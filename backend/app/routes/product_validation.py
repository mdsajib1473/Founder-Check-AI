"""
Product Validation API Routes
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.services.product_validation import (
    product_validation_service,
    MoSCoWCategory
)

router = APIRouter(prefix="/api/validation", tags=["Product Validation"])


# ========== FEATURE PRIORITY MATRIX ==========

@router.post("/features/add")
async def add_feature(
    name: str,
    description: str,
    moscow: MoSCoWCategory,
    effort: int,
    impact: int,
    dependencies: List[str] = None
):
    """Add feature to priority matrix"""
    try:
        if effort < 1 or effort > 10 or impact < 1 or impact > 10:
            raise HTTPException(status_code=400, detail="Effort and impact must be 1-10")

        feature = product_validation_service.add_feature(
            name=name,
            description=description,
            moscow=moscow,
            effort=effort,
            impact=impact,
            dependencies=dependencies or []
        )
        return {
            'success': True,
            'feature': {
                'id': feature.feature_id,
                'name': feature.name,
                'moscow': feature.moscow_category.value,
                'effort': feature.effort_score,
                'impact': feature.impact_score,
                'priority_score': feature.priority_score
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/priority-matrix")
async def get_priority_matrix():
    """Get feature priority matrix (MoSCoW breakdown)"""
    try:
        matrix = product_validation_service.get_priority_matrix()
        return {
            'success': True,
            'matrix': matrix
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/effort-impact")
async def get_effort_impact_distribution():
    """Get effort vs impact distribution"""
    try:
        matrix = product_validation_service.get_priority_matrix()
        return {
            'success': True,
            'distribution': matrix['effort_vs_impact'],
            'chart_data': [
                {
                    'quadrant': 'High Impact\nLow Effort',
                    'count': matrix['effort_vs_impact']['high_impact_low_effort'],
                    'recommendation': 'Do first'
                },
                {
                    'quadrant': 'High Impact\nHigh Effort',
                    'count': matrix['effort_vs_impact']['high_impact_high_effort'],
                    'recommendation': 'Plan carefully'
                },
                {
                    'quadrant': 'Low Impact\nLow Effort',
                    'count': matrix['effort_vs_impact']['low_impact_low_effort'],
                    'recommendation': 'Quick wins'
                },
                {
                    'quadrant': 'Low Impact\nHigh Effort',
                    'count': matrix['effort_vs_impact']['low_impact_high_effort'],
                    'recommendation': 'Avoid'
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dependencies/{feature_id}")
async def resolve_feature_dependencies(feature_id: str):
    """Get dependency resolution order"""
    try:
        resolved = product_validation_service.resolve_dependencies(feature_id)
        if not resolved:
            raise HTTPException(status_code=404, detail="Feature not found")

        return {
            'success': True,
            'feature_id': feature_id,
            'dependency_order': resolved,
            'count': len(resolved)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/roadmap")
async def get_release_roadmap():
    """Get release roadmap"""
    try:
        roadmap = product_validation_service.generate_release_roadmap()
        return {
            'success': True,
            'roadmap': roadmap,
            'total_phases': 3
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== CUSTOMER DEVELOPMENT FRAMEWORK ==========

@router.get("/interview/templates")
async def get_interview_templates():
    """Get available interview templates"""
    try:
        templates = product_validation_service.get_available_templates()
        return {
            'success': True,
            'templates': templates,
            'count': len(templates)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/interview/template/{template_name}")
async def get_interview_template(template_name: str):
    """Get specific interview template"""
    try:
        template = product_validation_service.get_interview_template(template_name)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")

        return {
            'success': True,
            'template_name': template_name,
            'questions': template,
            'count': len(template)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interview/create")
async def create_interview(
    template_name: str,
    respondent_name: str
):
    """Create new customer interview"""
    try:
        interview = product_validation_service.create_interview(
            template_name=template_name,
            respondent_name=respondent_name
        )
        return {
            'success': True,
            'interview': {
                'id': interview.interview_id,
                'template': interview.template_name,
                'respondent': interview.respondent_name,
                'questions_total': interview.total_questions,
                'date': interview.date.isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interview/{interview_id}/feedback")
async def add_interview_feedback(
    interview_id: str,
    key_insights: List[str],
    feedback: str
):
    """Add feedback to interview"""
    try:
        success = product_validation_service.add_interview_feedback(
            interview_id=interview_id,
            key_insights=key_insights,
            feedback=feedback
        )
        if not success:
            raise HTTPException(status_code=404, detail="Interview not found")

        return {
            'success': True,
            'interview_id': interview_id,
            'insights_count': len(key_insights),
            'status': 'Feedback recorded'
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/interview/insights")
async def get_iteration_insights(iteration_stage: int = None):
    """Get insights from iteration cycle"""
    try:
        insights = product_validation_service.get_iteration_insights(iteration_stage)
        if not insights:
            return {
                'success': True,
                'insights': {},
                'message': 'No interviews conducted yet'
            }

        return {
            'success': True,
            'insights': insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== MVP DEFINITION HELPER ==========

@router.post("/mvp/define")
async def define_mvp(
    product_name: str,
    core_features: List[str],
    non_essential_features: List[str],
    launch_weeks: int = 8
):
    """Define MVP for product"""
    try:
        if launch_weeks < 2 or launch_weeks > 24:
            raise HTTPException(status_code=400, detail="Launch weeks must be 2-24")

        mvp = product_validation_service.define_mvp(
            product_name=product_name,
            core_features=core_features,
            non_essential_features=non_essential_features,
            launch_weeks=launch_weeks
        )
        return {
            'success': True,
            'mvp': {
                'id': mvp.mvp_id,
                'product_name': mvp.product_name,
                'core_features_count': len(mvp.core_features),
                'nice_to_have_count': len(mvp.non_essential_features),
                'estimated_effort_hours': mvp.estimated_effort_hours,
                'launch_timeline_weeks': mvp.launch_timeline_weeks
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mvp/{mvp_id}/plan")
async def get_mvp_plan(mvp_id: str):
    """Get MVP plan with timeline"""
    try:
        plan = product_validation_service.get_mvp_plan(mvp_id)
        if not plan:
            raise HTTPException(status_code=404, detail="MVP not found")

        return {
            'success': True,
            'plan': plan
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/mvp/identify-core-features")
async def identify_core_features(all_features: List[str]):
    """Identify core vs nice-to-have features"""
    try:
        if not all_features:
            raise HTTPException(status_code=400, detail="Feature list cannot be empty")

        result = product_validation_service.identify_core_vs_nice_to_have(all_features)
        return {
            'success': True,
            'analysis': result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== ANALYTICS & SUMMARY ==========

@router.get("/summary")
async def get_validation_summary():
    """Get validation summary"""
    try:
        matrix = product_validation_service.get_priority_matrix()
        templates = product_validation_service.get_available_templates()

        return {
            'success': True,
            'summary': {
                'features_tracked': matrix['total_features'],
                'must_have_features': len(matrix['must_haves']),
                'should_have_features': len(matrix['should_haves']),
                'could_have_features': len(matrix['could_haves']),
                'wont_have_features': len(matrix['wont_haves']),
                'interview_templates': len(templates),
                'interviews_conducted': len(product_validation_service.interviews)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/features/bulk-add")
async def bulk_add_features(features: List[Dict]):
    """Add multiple features at once"""
    try:
        added_features = []
        for feature_data in features:
            feature = product_validation_service.add_feature(
                name=feature_data.get('name'),
                description=feature_data.get('description', ''),
                moscow=MoSCoWCategory(feature_data.get('moscow', 'could')),
                effort=feature_data.get('effort', 5),
                impact=feature_data.get('impact', 5),
                dependencies=feature_data.get('dependencies', [])
            )
            added_features.append({
                'id': feature.feature_id,
                'name': feature.name,
                'priority_score': feature.priority_score
            })

        return {
            'success': True,
            'added': len(added_features),
            'features': added_features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
