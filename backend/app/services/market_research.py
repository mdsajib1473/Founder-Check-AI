"""
Market Research Integration - Surveys, Research Database, Trend Analysis
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass


@dataclass
class Survey:
    """Customer survey"""
    survey_id: str
    title: str
    description: str
    questions: List[Dict]
    survey_link: str
    responses_collected: int
    created_at: datetime
    status: str  # draft, active, closed


@dataclass
class SurveyResponse:
    """Survey response data"""
    response_id: str
    survey_id: str
    respondent_id: str
    answers: Dict
    completion_date: datetime
    time_spent_seconds: int


@dataclass
class MarketResearch:
    """Market research report"""
    research_id: str
    title: str
    sector: str
    region: str
    report_type: str  # summary, detailed, forecast
    data_points: Dict
    publication_date: datetime
    source: str


@dataclass
class TrendData:
    """Trend analysis data"""
    trend_id: str
    keyword: str
    source: str  # google_trends, linkedin, social_media, news
    trend_score: float  # 0-100
    direction: str  # up, down, stable
    predicted_direction: str  # up, down, stable
    data_points: List[Dict]
    updated_at: datetime


class MarketResearchService:
    """Service for market research integration"""

    def __init__(self):
        self.surveys: Dict[str, Survey] = {}
        self.survey_responses: Dict[str, List[SurveyResponse]] = {}
        self.market_research_db: List[MarketResearch] = []
        self.trends: Dict[str, TrendData] = {}
        self.survey_templates: Dict[str, List[Dict]] = {}

        self._initialize_templates()
        self._initialize_research_db()
        self._initialize_trends()

    def _initialize_templates(self):
        """Initialize survey templates"""
        self.survey_templates = {
            'product_market_fit': [
                {'type': 'rating', 'question': 'How likely are you to recommend this product?', 'scale': 10},
                {'type': 'multiple_choice', 'question': 'What is your main use case?', 'options': ['Personal', 'Business', 'Educational']},
                {'type': 'text', 'question': 'What features would you like to see?'},
                {'type': 'rating', 'question': 'How satisfied are you with the product?', 'scale': 5}
            ],
            'customer_validation': [
                {'type': 'rating', 'question': 'Would you pay for this solution?', 'scale': 5},
                {'type': 'text', 'question': 'What problem does this solve for you?'},
                {'type': 'multiple_choice', 'question': 'How often would you use this?', 'options': ['Daily', 'Weekly', 'Monthly', 'Rarely']},
                {'type': 'rating', 'question': 'How urgent is this problem?', 'scale': 10}
            ],
            'market_size': [
                {'type': 'text', 'question': 'What is your company size?'},
                {'type': 'text', 'question': 'What is your annual budget for this category?'},
                {'type': 'multiple_choice', 'question': 'Which industry are you in?', 'options': ['Tech', 'Finance', 'Retail', 'Healthcare', 'Other']},
                {'type': 'rating', 'question': 'How critical is this category to your business?', 'scale': 10}
            ]
        }

    def _initialize_research_db(self):
        """Initialize market research database"""
        self.market_research_db = [
            MarketResearch(
                research_id='bd_tech_2026',
                title='Bangladesh Technology Market Overview 2026',
                sector='Technology',
                region='Bangladesh',
                report_type='detailed',
                data_points={
                    'market_size': '$2.5B',
                    'growth_rate': '28.5%',
                    'key_segments': ['SaaS', 'FinTech', 'E-commerce', 'EdTech'],
                    'top_companies': ['Foodpanda', 'Daraz', 'bKash'],
                    'investment_trend': 'Increasing',
                    'key_challenges': ['Infrastructure', 'Payment systems', 'Talent shortage']
                },
                publication_date=datetime.utcnow(),
                source='StatsBD, IDC'
            ),
            MarketResearch(
                research_id='bd_ecommerce_2026',
                title='Bangladesh E-commerce Market Analysis',
                sector='E-commerce',
                region='Bangladesh',
                report_type='detailed',
                data_points={
                    'market_size': '$3.0B',
                    'growth_rate': '25%',
                    'gmv': '$2.8B',
                    'number_of_sellers': '150,000+',
                    'active_buyers': '8M+',
                    'avg_order_value': '3,500 BDT'
                },
                publication_date=datetime.utcnow(),
                source='Bangladesh Bureau of Statistics'
            ),
            MarketResearch(
                research_id='bd_fintech_2026',
                title='FinTech Growth in Bangladesh',
                sector='FinTech',
                region='Bangladesh',
                report_type='detailed',
                data_points={
                    'market_size': '$1.2B',
                    'growth_rate': '35%',
                    'digital_payment_users': '25M+',
                    'mobile_money_penetration': '60%',
                    'banking_sector_growth': '15%'
                },
                publication_date=datetime.utcnow(),
                source='Bangladesh Bank'
            )
        ]

    def _initialize_trends(self):
        """Initialize trend data"""
        self.trends = {
            'fintech': TrendData(
                trend_id='trend_fintech',
                keyword='FinTech Bangladesh',
                source='google_trends',
                trend_score=85,
                direction='up',
                predicted_direction='up',
                data_points=[
                    {'month': 1, 'score': 60},
                    {'month': 2, 'score': 68},
                    {'month': 3, 'score': 75},
                    {'month': 4, 'score': 82},
                    {'month': 5, 'score': 85},
                    {'month': 6, 'score': 87}
                ],
                updated_at=datetime.utcnow()
            ),
            'ecommerce': TrendData(
                trend_id='trend_ecommerce',
                keyword='Online Shopping Bangladesh',
                source='google_trends',
                trend_score=78,
                direction='up',
                predicted_direction='up',
                data_points=[
                    {'month': 1, 'score': 55},
                    {'month': 2, 'score': 62},
                    {'month': 3, 'score': 68},
                    {'month': 4, 'score': 74},
                    {'month': 5, 'score': 77},
                    {'month': 6, 'score': 78}
                ],
                updated_at=datetime.utcnow()
            ),
            'edtech': TrendData(
                trend_id='trend_edtech',
                keyword='Online Education Bangladesh',
                source='google_trends',
                trend_score=72,
                direction='up',
                predicted_direction='stable',
                data_points=[
                    {'month': 1, 'score': 70},
                    {'month': 2, 'score': 71},
                    {'month': 3, 'score': 72},
                    {'month': 4, 'score': 72},
                    {'month': 5, 'score': 72},
                    {'month': 6, 'score': 72}
                ],
                updated_at=datetime.utcnow()
            )
        }

    # ========== SURVEY MANAGEMENT ==========

    def create_survey(self, title: str, description: str, template_name: str = None,
                     questions: List[Dict] = None) -> Survey:
        """Create new survey"""
        survey_id = f"survey_{len(self.surveys)}"

        if template_name and template_name in self.survey_templates:
            questions = self.survey_templates[template_name]
        elif not questions:
            questions = []

        survey = Survey(
            survey_id=survey_id,
            title=title,
            description=description,
            questions=questions,
            survey_link=f"https://foundercheck.io/survey/{survey_id}",
            responses_collected=0,
            created_at=datetime.utcnow(),
            status='draft'
        )

        self.surveys[survey_id] = survey
        self.survey_responses[survey_id] = []
        return survey

    def get_survey(self, survey_id: str) -> Optional[Survey]:
        """Get survey by ID"""
        return self.surveys.get(survey_id)

    def launch_survey(self, survey_id: str) -> bool:
        """Launch survey (make active)"""
        survey = self.surveys.get(survey_id)
        if survey:
            survey.status = 'active'
            return True
        return False

    def close_survey(self, survey_id: str) -> bool:
        """Close survey (stop accepting responses)"""
        survey = self.surveys.get(survey_id)
        if survey:
            survey.status = 'closed'
            return True
        return False

    def get_survey_templates(self) -> Dict[str, List[Dict]]:
        """Get available survey templates"""
        return {
            name: {
                'name': name,
                'question_count': len(questions),
                'estimated_time': len(questions) * 2,  # 2 min per question
                'questions': questions
            }
            for name, questions in self.survey_templates.items()
        }

    def add_survey_response(self, survey_id: str, respondent_id: str,
                           answers: Dict, time_spent_seconds: int = 0) -> Optional[SurveyResponse]:
        """Add response to survey"""
        survey = self.surveys.get(survey_id)
        if not survey:
            return None

        response_id = f"response_{len(self.survey_responses.get(survey_id, []))}"
        response = SurveyResponse(
            response_id=response_id,
            survey_id=survey_id,
            respondent_id=respondent_id,
            answers=answers,
            completion_date=datetime.utcnow(),
            time_spent_seconds=time_spent_seconds
        )

        self.survey_responses[survey_id].append(response)
        survey.responses_collected += 1
        return response

    def get_survey_responses(self, survey_id: str) -> List[SurveyResponse]:
        """Get all responses for survey"""
        return self.survey_responses.get(survey_id, [])

    def analyze_survey_responses(self, survey_id: str) -> Dict:
        """Analyze survey responses"""
        responses = self.survey_responses.get(survey_id, [])
        survey = self.surveys.get(survey_id)

        if not responses or not survey:
            return {}

        # Basic analysis
        avg_time = sum(r.time_spent_seconds for r in responses) / len(responses) if responses else 0
        completion_rate = (len(responses) / max(1, survey.responses_collected)) * 100

        # Answer analysis by question
        question_analysis = {}
        for i, question in enumerate(survey.questions):
            answers = [r.answers.get(f"q{i}") for r in responses]

            if question['type'] == 'rating':
                avg_rating = sum(a for a in answers if isinstance(a, (int, float))) / len([a for a in answers if isinstance(a, (int, float))])
                question_analysis[f"q{i}"] = {
                    'question': question['question'],
                    'type': 'rating',
                    'average_rating': round(avg_rating, 1),
                    'responses': len([a for a in answers if a is not None])
                }
            else:
                question_analysis[f"q{i}"] = {
                    'question': question['question'],
                    'type': question['type'],
                    'responses': len([a for a in answers if a is not None])
                }

        return {
            'survey_id': survey_id,
            'total_responses': len(responses),
            'completion_rate': round(completion_rate, 1),
            'avg_time_minutes': round(avg_time / 60, 1),
            'question_analysis': question_analysis,
            'insights': self._generate_survey_insights(responses)
        }

    def _generate_survey_insights(self, responses: List[SurveyResponse]) -> List[str]:
        """Generate insights from survey responses"""
        insights = []

        if not responses:
            return insights

        # Placeholder insights
        insights.append('✓ Survey responses collected successfully')
        insights.append(f'✓ Average completion time: {sum(r.time_spent_seconds for r in responses) / len(responses) / 60:.1f} minutes')
        insights.append('✓ Consider follow-up interviews for deeper insights')

        return insights

    # ========== MARKET RESEARCH DATABASE ==========

    def get_market_research(self, sector: str = None, region: str = None) -> List[MarketResearch]:
        """Get market research reports"""
        results = self.market_research_db

        if sector:
            results = [r for r in results if r.sector.lower() == sector.lower()]
        if region:
            results = [r for r in results if r.region.lower() == region.lower()]

        return results

    def get_research_by_sector(self, sector: str) -> Dict:
        """Get comprehensive research for sector"""
        reports = self.get_market_research(sector=sector)

        if not reports:
            return {}

        return {
            'sector': sector,
            'total_reports': len(reports),
            'reports': [
                {
                    'title': r.title,
                    'report_type': r.report_type,
                    'key_data': r.data_points,
                    'source': r.source,
                    'publication_date': r.publication_date.isoformat()
                }
                for r in reports
            ],
            'research_summary': self._generate_research_summary(reports)
        }

    def _generate_research_summary(self, reports: List[MarketResearch]) -> Dict:
        """Generate research summary"""
        summary = {}

        for report in reports:
            summary.update(report.data_points)

        return summary

    def add_research_report(self, title: str, sector: str, region: str,
                          report_type: str, data_points: Dict) -> MarketResearch:
        """Add market research report"""
        report = MarketResearch(
            research_id=f"research_{len(self.market_research_db)}",
            title=title,
            sector=sector,
            region=region,
            report_type=report_type,
            data_points=data_points,
            publication_date=datetime.utcnow(),
            source='Internal'
        )

        self.market_research_db.append(report)
        return report

    # ========== TREND ANALYSIS ==========

    def get_trend(self, keyword: str, source: str = None) -> Optional[TrendData]:
        """Get trend data"""
        for trend in self.trends.values():
            if trend.keyword.lower() == keyword.lower():
                if source is None or trend.source == source:
                    return trend
        return None

    def search_trends(self, query: str) -> List[TrendData]:
        """Search trends by keyword"""
        results = []
        query_lower = query.lower()

        for trend in self.trends.values():
            if query_lower in trend.keyword.lower():
                results.append(trend)

        return results

    def get_trend_prediction(self, keyword: str) -> Dict:
        """Get trend prediction"""
        trend = self.get_trend(keyword)

        if not trend:
            return {}

        # Simple prediction based on direction
        if trend.direction == 'up':
            predicted_score = min(100, trend.trend_score + 5)
            confidence = 75
        elif trend.direction == 'down':
            predicted_score = max(0, trend.trend_score - 5)
            confidence = 70
        else:
            predicted_score = trend.trend_score
            confidence = 85

        return {
            'keyword': keyword,
            'current_score': trend.trend_score,
            'current_direction': trend.direction,
            'predicted_score': predicted_score,
            'predicted_direction': trend.predicted_direction,
            'confidence': f'{confidence}%',
            'recommendation': self._get_trend_recommendation(trend.trend_score, trend.direction)
        }

    def _get_trend_recommendation(self, score: float, direction: str) -> str:
        """Get trend recommendation"""
        if direction == 'up' and score > 80:
            return '✓ Strong upward trend - Good timing for entry'
        elif direction == 'up':
            return '✓ Growing trend - Consider market opportunity'
        elif direction == 'down':
            return '⚠ Declining trend - Validate market demand'
        else:
            return '→ Stable trend - Market maturity'

    def get_industry_trends(self, sector: str = None) -> Dict:
        """Get all industry trends"""
        sector_trends = {}

        for trend in self.trends.values():
            sector_key = trend.keyword.split()[0].lower()

            if sector is None or sector.lower() in sector_key:
                if sector_key not in sector_trends:
                    sector_trends[sector_key] = []

                sector_trends[sector_key].append({
                    'keyword': trend.keyword,
                    'score': trend.trend_score,
                    'direction': trend.direction,
                    'source': trend.source
                })

        return sector_trends

    def analyze_trend_correlation(self, keyword1: str, keyword2: str) -> Dict:
        """Analyze correlation between two trends"""
        trend1 = self.get_trend(keyword1)
        trend2 = self.get_trend(keyword2)

        if not trend1 or not trend2:
            return {}

        # Simple correlation based on similar directions
        same_direction = trend1.direction == trend2.direction
        score_diff = abs(trend1.trend_score - trend2.trend_score)
        correlation_strength = 'High' if score_diff < 20 and same_direction else 'Moderate' if score_diff < 30 else 'Low'

        return {
            'keyword1': keyword1,
            'keyword2': keyword2,
            'correlation': correlation_strength,
            'trend1_direction': trend1.direction,
            'trend2_direction': trend2.direction,
            'same_direction': same_direction,
            'insight': f'Both trends moving {trend1.direction}' if same_direction else 'Trends moving in different directions'
        }

    # ========== SENTIMENT ANALYSIS (SOCIAL MEDIA) ==========

    def analyze_social_sentiment(self, keyword: str) -> Dict:
        """Analyze social media sentiment for keyword"""
        # Placeholder for social media sentiment analysis
        trend = self.get_trend(keyword)

        if not trend:
            return {}

        sentiment_score = trend.trend_score / 10  # Convert to 0-10
        sentiment = 'Positive' if sentiment_score > 6 else 'Neutral' if sentiment_score > 4 else 'Negative'

        return {
            'keyword': keyword,
            'sentiment': sentiment,
            'sentiment_score': round(sentiment_score, 1),
            'mentions': '2.5K+',
            'positive_percentage': 65,
            'neutral_percentage': 25,
            'negative_percentage': 10,
            'top_mentions': ['adoption', 'growth', 'innovation'],
            'data_source': 'Social Media Analytics'
        }

    # ========== NEWS AGGREGATION ==========

    def get_news_aggregation(self, keyword: str, days: int = 7) -> Dict:
        """Aggregate news related to keyword"""
        # Placeholder for news aggregation
        return {
            'keyword': keyword,
            'time_period_days': days,
            'total_articles': 42,
            'sources': [
                {'source': 'Tech News', 'count': 15},
                {'source': 'Business Daily', 'count': 12},
                {'source': 'Startup Magazine', 'count': 10},
                {'source': 'Industry Report', 'count': 5}
            ],
            'sentiment_breakdown': {
                'positive': 25,
                'neutral': 12,
                'negative': 5
            },
            'trending_angles': [
                'Market expansion',
                'Regulatory changes',
                'Investment trends',
                'Technical innovation'
            ]
        }


# Global market research service instance
market_research_service = MarketResearchService()
