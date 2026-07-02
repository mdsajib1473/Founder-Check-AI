"""
Product Validation Features - Feature Prioritization, Customer Development, MVP Definition
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass
from enum import Enum


class MoSCoWCategory(str, Enum):
    MUST = "must"
    SHOULD = "should"
    COULD = "could"
    WONT = "wont"


@dataclass
class Feature:
    """Product feature"""
    feature_id: str
    name: str
    description: str
    moscow_category: MoSCoWCategory
    effort_score: int  # 1-10
    impact_score: int  # 1-10
    dependencies: List[str]
    priority_score: float
    status: str  # backlog, in_progress, completed


@dataclass
class Interview:
    """Customer interview"""
    interview_id: str
    template_name: str
    respondent_name: str
    date: datetime
    questions_answered: int
    total_questions: int
    key_insights: List[str]
    feedback: str
    iteration_stage: int


@dataclass
class MVPDefinition:
    """MVP definition"""
    mvp_id: str
    product_name: str
    core_features: List[str]
    non_essential_features: List[str]
    launch_timeline_weeks: int
    success_metrics: Dict[str, str]
    target_users: int
    estimated_effort_hours: int


class ProductValidationService:
    """Service for product validation and MVP definition"""

    def __init__(self):
        self.features: Dict[str, Feature] = {}
        self.interviews: Dict[str, Interview] = {}
        self.mvp_definitions: Dict[str, MVPDefinition] = {}
        self.interview_templates: Dict[str, List[Dict]] = {}
        self.release_roadmaps: Dict[str, List[Dict]] = {}

        self._initialize_templates()

    def _initialize_templates(self):
        """Initialize interview templates"""
        self.interview_templates = {
            'customer_discovery': [
                {'question': 'What problem are you trying to solve?', 'type': 'open'},
                {'question': 'How do you currently solve this problem?', 'type': 'open'},
                {'question': 'How frequently do you face this problem?', 'type': 'rating'},
                {'question': 'How critical is this problem to your business?', 'type': 'rating'},
                {'question': 'What would your ideal solution look like?', 'type': 'open'},
                {'question': 'How much would you pay for this solution?', 'type': 'text'},
                {'question': 'Would you use this product?', 'type': 'yes_no'}
            ],
            'problem_validation': [
                {'question': 'Tell me about the last time you encountered this problem', 'type': 'open'},
                {'question': 'How much time/money does this problem cost you?', 'type': 'open'},
                {'question': 'Have you tried other solutions?', 'type': 'yes_no'},
                {'question': 'Why didnt those solutions work?', 'type': 'open'},
                {'question': 'On a scale 1-10, how painful is this problem?', 'type': 'rating'},
                {'question': 'Who else experiences this problem?', 'type': 'open'}
            ],
            'solution_validation': [
                {'question': 'Would you use a product like this?', 'type': 'yes_no'},
                {'question': 'What features are most important to you?', 'type': 'open'},
                {'question': 'What would make you NOT use this product?', 'type': 'open'},
                {'question': 'How often would you use this?', 'type': 'open'},
                {'question': 'Would you pay for this? How much?', 'type': 'open'},
                {'question': 'Who would you recommend this to?', 'type': 'open'}
            ]
        }

    # ========== FEATURE PRIORITY MATRIX ==========

    def add_feature(self, name: str, description: str, moscow: MoSCoWCategory,
                   effort: int, impact: int, dependencies: List[str] = None) -> Feature:
        """Add feature to priority matrix"""
        feature_id = f"feature_{len(self.features)}"
        dependencies = dependencies or []

        # Calculate priority score (impact weighted 60%, effort weighted 40%)
        priority_score = (impact * 0.6) / max(1, effort * 0.4)

        feature = Feature(
            feature_id=feature_id,
            name=name,
            description=description,
            moscow_category=moscow,
            effort_score=effort,
            impact_score=impact,
            dependencies=dependencies,
            priority_score=round(priority_score, 2),
            status='backlog'
        )

        self.features[feature_id] = feature
        return feature

    def get_priority_matrix(self) -> Dict:
        """Get feature priority matrix"""
        must_haves = []
        should_haves = []
        could_haves = []
        wont_haves = []

        for feature in sorted(self.features.values(), key=lambda f: f.priority_score, reverse=True):
            feature_data = {
                'id': feature.feature_id,
                'name': feature.name,
                'effort': feature.effort_score,
                'impact': feature.impact_score,
                'priority_score': feature.priority_score,
                'dependencies': feature.dependencies
            }

            if feature.moscow_category == MoSCoWCategory.MUST:
                must_haves.append(feature_data)
            elif feature.moscow_category == MoSCoWCategory.SHOULD:
                should_haves.append(feature_data)
            elif feature.moscow_category == MoSCoWCategory.COULD:
                could_haves.append(feature_data)
            else:
                wont_haves.append(feature_data)

        return {
            'must_haves': must_haves,
            'should_haves': should_haves,
            'could_haves': could_haves,
            'wont_haves': wont_haves,
            'total_features': len(self.features),
            'effort_vs_impact': self._calculate_effort_impact_distribution()
        }

    def _calculate_effort_impact_distribution(self) -> Dict:
        """Calculate effort vs impact distribution"""
        high_impact_low_effort = 0
        high_impact_high_effort = 0
        low_impact_low_effort = 0
        low_impact_high_effort = 0

        for feature in self.features.values():
            if feature.impact_score > 5 and feature.effort_score <= 5:
                high_impact_low_effort += 1
            elif feature.impact_score > 5 and feature.effort_score > 5:
                high_impact_high_effort += 1
            elif feature.impact_score <= 5 and feature.effort_score <= 5:
                low_impact_low_effort += 1
            else:
                low_impact_high_effort += 1

        return {
            'high_impact_low_effort': high_impact_low_effort,
            'high_impact_high_effort': high_impact_high_effort,
            'low_impact_low_effort': low_impact_low_effort,
            'low_impact_high_effort': low_impact_high_effort
        }

    def resolve_dependencies(self, feature_id: str) -> List[str]:
        """Get dependency resolution order"""
        feature = self.features.get(feature_id)
        if not feature:
            return []

        resolved = []
        visited = set()

        def resolve(fid: str):
            if fid in visited:
                return
            visited.add(fid)

            feat = self.features.get(fid)
            if feat:
                for dep_id in feat.dependencies:
                    resolve(dep_id)
                resolved.append(fid)

        resolve(feature_id)
        return resolved

    def generate_release_roadmap(self) -> Dict:
        """Generate release roadmap"""
        must_features = [f for f in self.features.values() if f.moscow_category == MoSCoWCategory.MUST]
        should_features = [f for f in self.features.values() if f.moscow_category == MoSCoWCategory.SHOULD]
        could_features = [f for f in self.features.values() if f.moscow_category == MoSCoWCategory.COULD]

        # Sort by priority
        must_sorted = sorted(must_features, key=lambda f: f.priority_score, reverse=True)
        should_sorted = sorted(should_features, key=lambda f: f.priority_score, reverse=True)
        could_sorted = sorted(could_features, key=lambda f: f.priority_score, reverse=True)

        roadmap = {
            'mvp_release': {
                'phase': 'MVP Release',
                'features': [f.name for f in must_sorted[:5]],
                'estimated_weeks': 8,
                'description': 'Core features needed for product launch'
            },
            'v1_0_release': {
                'phase': 'v1.0 Release',
                'features': [f.name for f in should_sorted[:5]],
                'estimated_weeks': 12,
                'description': 'Enhanced version with key improvements'
            },
            'future_releases': {
                'phase': 'Future Roadmap',
                'features': [f.name for f in could_sorted[:5]],
                'estimated_weeks': 20,
                'description': 'Nice-to-have features for long-term growth'
            }
        }

        return roadmap

    # ========== CUSTOMER DEVELOPMENT FRAMEWORK ==========

    def get_interview_template(self, template_name: str) -> Optional[List[Dict]]:
        """Get interview template"""
        return self.interview_templates.get(template_name)

    def get_available_templates(self) -> Dict[str, Dict]:
        """Get all available interview templates"""
        return {
            name: {
                'name': name,
                'question_count': len(questions),
                'estimated_time_minutes': len(questions) * 3,
                'use_case': {
                    'customer_discovery': 'Understand customer problems and needs',
                    'problem_validation': 'Validate that the problem is real and urgent',
                    'solution_validation': 'Test if your proposed solution resonates'
                }.get(name, '')
            }
            for name, questions in self.interview_templates.items()
        }

    def create_interview(self, template_name: str, respondent_name: str) -> Interview:
        """Create new customer interview"""
        template = self.interview_templates.get(template_name, [])
        interview_id = f"interview_{len(self.interviews)}"

        interview = Interview(
            interview_id=interview_id,
            template_name=template_name,
            respondent_name=respondent_name,
            date=datetime.utcnow(),
            questions_answered=0,
            total_questions=len(template),
            key_insights=[],
            feedback='',
            iteration_stage=1
        )

        self.interviews[interview_id] = interview
        return interview

    def add_interview_feedback(self, interview_id: str, key_insights: List[str],
                              feedback: str) -> bool:
        """Add feedback to interview"""
        interview = self.interviews.get(interview_id)
        if not interview:
            return False

        interview.key_insights = key_insights
        interview.feedback = feedback
        interview.questions_answered = interview.total_questions
        return True

    def get_iteration_insights(self, iteration_stage: int = None) -> Dict:
        """Get insights from iteration cycle"""
        stage_interviews = []

        if iteration_stage:
            stage_interviews = [i for i in self.interviews.values() if i.iteration_stage == iteration_stage]
        else:
            stage_interviews = list(self.interviews.values())

        if not stage_interviews:
            return {}

        all_insights = []
        for interview in stage_interviews:
            all_insights.extend(interview.key_insights)

        return {
            'iteration_stage': iteration_stage or 'all',
            'total_interviews': len(stage_interviews),
            'total_insights': len(all_insights),
            'key_themes': self._extract_themes(all_insights),
            'recommendations': self._generate_recommendations(all_insights)
        }

    def _extract_themes(self, insights: List[str]) -> List[str]:
        """Extract common themes from insights"""
        theme_keywords = {
            'pricing': ['price', 'cost', 'expensive', 'affordable'],
            'ease_of_use': ['easy', 'difficult', 'user-friendly', 'complicated'],
            'features': ['feature', 'capability', 'function', 'need'],
            'support': ['support', 'help', 'documentation', 'training'],
            'integration': ['integrate', 'connect', 'api', 'sync']
        }

        themes = {}
        for insight in insights:
            insight_lower = insight.lower()
            for theme, keywords in theme_keywords.items():
                if any(kw in insight_lower for kw in keywords):
                    themes[theme] = themes.get(theme, 0) + 1

        return sorted(themes.items(), key=lambda x: x[1], reverse=True)

    def _generate_recommendations(self, insights: List[str]) -> List[str]:
        """Generate recommendations from insights"""
        recommendations = []

        if len(insights) > 5:
            recommendations.append('✓ Sufficient feedback collected - ready for product iteration')
        else:
            recommendations.append('⚠ Conduct more interviews for comprehensive feedback')

        if any('pain' in i.lower() or 'problem' in i.lower() for i in insights):
            recommendations.append('✓ Problem is validated and urgent')
        else:
            recommendations.append('⚠ Problem validation may need more investigation')

        if any('price' in i.lower() or 'cost' in i.lower() for i in insights):
            recommendations.append('✓ Consider pricing strategy in product planning')

        return recommendations

    # ========== MVP DEFINITION HELPER ==========

    def define_mvp(self, product_name: str, core_features: List[str],
                  non_essential_features: List[str], launch_weeks: int = 8) -> MVPDefinition:
        """Define MVP for product"""
        mvp_id = f"mvp_{len(self.mvp_definitions)}"

        # Calculate effort estimation
        base_effort = 20
        effort_per_feature = 15
        estimated_effort = base_effort + (len(core_features) * effort_per_feature)

        # Define success metrics
        success_metrics = {
            'user_retention': '60%+ retention after 1 month',
            'nps_score': '40+ Net Promoter Score',
            'feature_adoption': '80%+ core feature adoption',
            'launch_timeline': f'{launch_weeks} weeks',
            'user_acquisition': '100+ beta users'
        }

        mvp = MVPDefinition(
            mvp_id=mvp_id,
            product_name=product_name,
            core_features=core_features,
            non_essential_features=non_essential_features,
            launch_timeline_weeks=launch_weeks,
            success_metrics=success_metrics,
            target_users=100,
            estimated_effort_hours=estimated_effort
        )

        self.mvp_definitions[mvp_id] = mvp
        return mvp

    def get_mvp_plan(self, mvp_id: str) -> Dict:
        """Get MVP plan with timeline"""
        mvp = self.mvp_definitions.get(mvp_id)
        if not mvp:
            return {}

        # Create phase timeline
        phases = [
            {
                'phase': 'Week 1-2: Setup & Architecture',
                'tasks': ['Setup development environment', 'Design system architecture', 'Database schema'],
                'effort_hours': mvp.estimated_effort_hours * 0.15
            },
            {
                'phase': 'Week 3-5: Core Features',
                'tasks': [f'Develop: {f}' for f in mvp.core_features[:3]],
                'effort_hours': mvp.estimated_effort_hours * 0.50
            },
            {
                'phase': 'Week 6-7: Testing & Refinement',
                'tasks': ['QA testing', 'Bug fixes', 'Performance optimization'],
                'effort_hours': mvp.estimated_effort_hours * 0.20
            },
            {
                'phase': 'Week 8: Launch',
                'tasks': ['Production deployment', 'User onboarding', 'Launch communications'],
                'effort_hours': mvp.estimated_effort_hours * 0.15
            }
        ]

        return {
            'product_name': mvp.product_name,
            'mvp_features': mvp.core_features,
            'excluded_features': mvp.non_essential_features,
            'total_effort_hours': mvp.estimated_effort_hours,
            'timeline_weeks': mvp.launch_timeline_weeks,
            'phases': phases,
            'success_metrics': mvp.success_metrics,
            'target_users': mvp.target_users,
            'recommendation': self._get_mvp_recommendation(mvp)
        }

    def _get_mvp_recommendation(self, mvp: MVPDefinition) -> str:
        """Get MVP recommendation"""
        feature_count = len(mvp.core_features)

        if feature_count <= 3:
            return '✓ Focused MVP - good scope for 8-week launch'
        elif feature_count <= 6:
            return '⚠ Moderate scope - ensure team capacity'
        else:
            return '✗ Scope too large for MVP - consider deferring non-critical features'

    def identify_core_vs_nice_to_have(self, all_features: List[str]) -> Dict:
        """Identify core vs nice-to-have features"""
        # Simple heuristic: if mentioned in MUST category, it's core
        must_features = [f.name for f in self.features.values() if f.moscow_category == MoSCoWCategory.MUST]

        core_features = [f for f in all_features if any(m.lower() in f.lower() for m in must_features)]
        nice_to_have = [f for f in all_features if f not in core_features]

        return {
            'core_features': core_features or all_features[:len(all_features) // 2],
            'nice_to_have_features': nice_to_have or all_features[len(all_features) // 2:],
            'core_count': len(core_features) or len(all_features) // 2,
            'nice_to_have_count': len(nice_to_have) or len(all_features) - (len(all_features) // 2),
            'recommendation': 'Start with core features, iterate based on user feedback'
        }


# Global product validation service instance
product_validation_service = ProductValidationService()
