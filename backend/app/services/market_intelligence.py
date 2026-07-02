"""
Market Intelligence Service - Market data, competitor tracking, industry benchmarks
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass


@dataclass
class MarketData:
    """Real-time market data"""
    sector: str
    market_size: float  # in billions
    growth_rate: float  # annual percentage
    projected_growth: float  # next 3 years
    tam: float  # Total Addressable Market
    sam: float  # Serviceable Addressable Market
    som: float  # Serviceable Obtainable Market
    updated_at: datetime
    source: str
    trends: List[str]


@dataclass
class CompetitorData:
    """Competitor tracking data"""
    competitor_id: str
    name: str
    sector: str
    founded_year: int
    funding_raised: float
    latest_valuation: float
    market_share: float
    employee_count: int
    key_products: List[str]
    strengths: List[str]
    weaknesses: List[str]
    last_updated: datetime
    price_range: Optional[Dict] = None
    growth_rate: float = 0.0


@dataclass
class IndustryBenchmark:
    """Industry benchmark data"""
    sector: str
    metric_name: str  # CAC, LTV, Churn, Margin, Growth
    median_value: float
    percentile_25: float
    percentile_75: float
    percentile_90: float
    company_size: str  # early-stage, growth, mature
    region: str
    last_updated: datetime


class MarketIntelligenceService:
    """Service for market intelligence and benchmarking"""

    def __init__(self):
        self.market_data: Dict[str, MarketData] = {}
        self.competitor_data: Dict[str, CompetitorData] = {}
        self.competitor_history: Dict[str, List[CompetitorData]] = {}
        self.benchmarks: Dict[str, IndustryBenchmark] = {}
        self.swot_trends: Dict[str, List[Dict]] = {}
        self.news_alerts: List[Dict] = []
        self.economic_indicators: Dict[str, float] = {}

        # Initialize with sample data
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        """Initialize with realistic market data"""

        # Bangladesh Tech Market Data
        self.market_data['technology_bd'] = MarketData(
            sector='Technology',
            market_size=2.5,
            growth_rate=28.5,
            projected_growth=35.0,
            tam=15.0,  # Global addressable market
            sam=5.0,   # Bangladesh + South Asia
            som=0.5,   # Realistic obtainable
            updated_at=datetime.utcnow(),
            source='StatsBD, IDC',
            trends=['Mobile-first adoption', 'FinTech growth', 'E-commerce expansion']
        )

        # E-commerce Market
        self.market_data['ecommerce_bd'] = MarketData(
            sector='E-commerce',
            market_size=3.0,
            growth_rate=25.0,
            projected_growth=32.0,
            tam=20.0,
            sam=8.0,
            som=1.0,
            updated_at=datetime.utcnow(),
            source='Bangladesh Bureau of Statistics',
            trends=['Same-day delivery demand', 'Digital payments', 'Rural expansion']
        )

        # Initialize benchmarks
        self._initialize_benchmarks()

        # Initialize competitor data
        self._initialize_competitors()

    def _initialize_benchmarks(self):
        """Initialize industry benchmarks"""

        benchmarks_data = [
            # Tech SaaS benchmarks
            ('technology_saas', 'CAC', 1500, 800, 2500, 4000, 'early-stage', 'Bangladesh'),
            ('technology_saas', 'LTV', 45000, 20000, 100000, 250000, 'early-stage', 'Bangladesh'),
            ('technology_saas', 'Churn', 5.0, 2.0, 10.0, 15.0, 'early-stage', 'Bangladesh'),
            ('technology_saas', 'Gross_Margin', 75.0, 60.0, 85.0, 90.0, 'early-stage', 'Bangladesh'),
            ('technology_saas', 'Growth_Rate', 120.0, 80.0, 180.0, 250.0, 'early-stage', 'Bangladesh'),

            # E-commerce benchmarks
            ('ecommerce', 'CAC', 500, 200, 1000, 2000, 'early-stage', 'Bangladesh'),
            ('ecommerce', 'LTV', 15000, 5000, 35000, 80000, 'early-stage', 'Bangladesh'),
            ('ecommerce', 'Churn', 8.0, 3.0, 15.0, 25.0, 'early-stage', 'Bangladesh'),
            ('ecommerce', 'Gross_Margin', 45.0, 30.0, 60.0, 75.0, 'early-stage', 'Bangladesh'),
            ('ecommerce', 'Growth_Rate', 100.0, 60.0, 150.0, 200.0, 'early-stage', 'Bangladesh'),

            # FinTech benchmarks
            ('fintech', 'CAC', 2000, 1000, 3500, 6000, 'early-stage', 'Bangladesh'),
            ('fintech', 'LTV', 80000, 40000, 150000, 300000, 'early-stage', 'Bangladesh'),
            ('fintech', 'Churn', 3.0, 1.0, 6.0, 12.0, 'early-stage', 'Bangladesh'),
            ('fintech', 'Gross_Margin', 70.0, 50.0, 85.0, 95.0, 'early-stage', 'Bangladesh'),
            ('fintech', 'Growth_Rate', 150.0, 100.0, 250.0, 400.0, 'early-stage', 'Bangladesh'),
        ]

        for sector, metric, median, p25, p75, p90, size, region in benchmarks_data:
            key = f"{sector}_{metric}_{size}_{region}"
            self.benchmarks[key] = IndustryBenchmark(
                sector=sector,
                metric_name=metric,
                median_value=median,
                percentile_25=p25,
                percentile_75=p75,
                percentile_90=p90,
                company_size=size,
                region=region,
                last_updated=datetime.utcnow()
            )

    def _initialize_competitors(self):
        """Initialize competitor data"""

        competitors = [
            CompetitorData(
                competitor_id='foodpanda_bd',
                name='Foodpanda',
                sector='Food Delivery',
                founded_year=2013,
                funding_raised=50.0,
                latest_valuation=200.0,
                market_share=35.0,
                employee_count=500,
                key_products=['Food Delivery', 'Groceries'],
                strengths=['Brand recognition', 'Wide coverage', 'Payment integration'],
                weaknesses=['High commission', 'Customer service'],
                last_updated=datetime.utcnow(),
                price_range={'min': 50, 'max': 500},
                growth_rate=22.0
            ),
            CompetitorData(
                competitor_id='uber_eats_bd',
                name='Uber Eats',
                sector='Food Delivery',
                founded_year=2014,
                funding_raised=100.0,
                latest_valuation=500.0,
                market_share=25.0,
                employee_count=400,
                key_products=['Food Delivery', 'Quick Commerce'],
                strengths=['Global brand', 'Technology', 'Logistics network'],
                weaknesses=['High operational costs', 'Limited local partnerships'],
                last_updated=datetime.utcnow(),
                price_range={'min': 60, 'max': 600},
                growth_rate=18.0
            ),
            CompetitorData(
                competitor_id='daraz_bd',
                name='Daraz',
                sector='E-commerce',
                founded_year=2012,
                funding_raised=150.0,
                latest_valuation=1000.0,
                market_share=45.0,
                employee_count=2000,
                key_products=['Marketplace', 'Payments', 'Logistics'],
                strengths=['Dominant market position', 'Wide selection', 'Fast delivery'],
                weaknesses=['High fees', 'Seller support'],
                last_updated=datetime.utcnow(),
                growth_rate=20.0
            ),
        ]

        for competitor in competitors:
            self.competitor_data[competitor.competitor_id] = competitor
            if competitor.competitor_id not in self.competitor_history:
                self.competitor_history[competitor.competitor_id] = []
            self.competitor_history[competitor.competitor_id].append(competitor)

    # ========== MARKET DATA ==========

    def get_market_data(self, sector: str) -> Optional[MarketData]:
        """Get current market data for sector"""
        return self.market_data.get(sector.lower().replace(' ', '_'))

    def get_market_overview(self, sector: str) -> Dict:
        """Get comprehensive market overview"""
        data = self.get_market_data(sector)
        if not data:
            return {}

        return {
            'sector': data.sector,
            'market_size_bn': round(data.market_size, 2),
            'annual_growth': round(data.growth_rate, 1),
            'projected_3yr_growth': round(data.projected_growth, 1),
            'tam': round(data.tam, 2),
            'sam': round(data.sam, 2),
            'som': round(data.som, 2),
            'opportunity': self._calculate_opportunity(data),
            'key_trends': data.trends,
            'updated': data.updated_at.isoformat()
        }

    def _calculate_opportunity(self, data: MarketData) -> str:
        """Calculate market opportunity level"""
        if data.som > 0.5 and data.growth_rate > 25:
            return 'Excellent'
        elif data.som > 0.3 and data.growth_rate > 15:
            return 'Good'
        elif data.som > 0.1:
            return 'Moderate'
        else:
            return 'Limited'

    # ========== COMPETITOR TRACKING ==========

    def get_competitor(self, competitor_id: str) -> Optional[CompetitorData]:
        """Get competitor data"""
        return self.competitor_data.get(competitor_id)

    def get_competitors_by_sector(self, sector: str) -> List[CompetitorData]:
        """Get all competitors in sector"""
        return [c for c in self.competitor_data.values() if c.sector.lower() == sector.lower()]

    def track_competitor_metric(self, competitor_id: str, metric: str, value: float):
        """Track competitor metric over time"""
        competitor = self.get_competitor(competitor_id)
        if not competitor:
            return False

        if metric == 'market_share':
            competitor.market_share = value
        elif metric == 'growth_rate':
            competitor.growth_rate = value
        elif metric == 'valuation':
            competitor.latest_valuation = value

        # Record history
        competitor.last_updated = datetime.utcnow()
        self.competitor_history[competitor_id].append(competitor)
        return True

    def get_competitor_history(self, competitor_id: str) -> List[Dict]:
        """Get competitor historical data"""
        history = self.competitor_history.get(competitor_id, [])
        return [
            {
                'market_share': c.market_share,
                'growth_rate': c.growth_rate,
                'valuation': c.latest_valuation,
                'date': c.last_updated.isoformat()
            }
            for c in history[-12:]  # Last 12 records
        ]

    def get_competitive_landscape(self, sector: str) -> Dict:
        """Get complete competitive landscape"""
        competitors = self.get_competitors_by_sector(sector)

        total_market_share = sum(c.market_share for c in competitors)

        return {
            'sector': sector,
            'competitor_count': len(competitors),
            'top_competitors': [
                {
                    'name': c.name,
                    'market_share_pct': round(c.market_share, 1),
                    'valuation_m': round(c.latest_valuation, 0),
                    'growth_rate': round(c.growth_rate, 1),
                    'employees': c.employee_count
                }
                for c in sorted(competitors, key=lambda x: x.market_share, reverse=True)[:5]
            ],
            'market_concentration': round((total_market_share / (100 if total_market_share > 0 else 1)) * 100, 1),
            'consolidation_level': self._get_consolidation_level(total_market_share)
        }

    def _get_consolidation_level(self, total_share: float) -> str:
        """Determine market consolidation level"""
        if total_share > 80:
            return 'Highly Consolidated'
        elif total_share > 60:
            return 'Moderately Consolidated'
        else:
            return 'Fragmented'

    # ========== INDUSTRY BENCHMARKS ==========

    def get_benchmark(self, sector: str, metric: str, company_size: str = 'early-stage',
                     region: str = 'Bangladesh') -> Optional[IndustryBenchmark]:
        """Get industry benchmark"""
        key = f"{sector}_{metric}_{company_size}_{region}"
        return self.benchmarks.get(key)

    def compare_to_benchmark(self, sector: str, metric: str, actual_value: float,
                            company_size: str = 'early-stage') -> Dict:
        """Compare metric to industry benchmark"""
        benchmark = self.get_benchmark(sector, metric, company_size)
        if not benchmark:
            return {'status': 'No benchmark available'}

        percentile = self._calculate_percentile(actual_value, benchmark)
        performance = self._get_performance_label(actual_value, benchmark)

        return {
            'metric': metric,
            'your_value': round(actual_value, 2),
            'benchmark_median': round(benchmark.median_value, 2),
            'percentile_25': round(benchmark.percentile_25, 2),
            'percentile_75': round(benchmark.percentile_75, 2),
            'percentile_90': round(benchmark.percentile_90, 2),
            'percentile_rank': percentile,
            'performance': performance,
            'recommendation': self._get_benchmark_recommendation(metric, percentile)
        }

    def _calculate_percentile(self, value: float, benchmark: IndustryBenchmark) -> str:
        """Calculate percentile ranking"""
        if value >= benchmark.percentile_90:
            return 'Top 10%'
        elif value >= benchmark.percentile_75:
            return 'Top 25%'
        elif value >= benchmark.median_value:
            return 'Above Median'
        elif value >= benchmark.percentile_25:
            return 'Below Median'
        else:
            return 'Bottom 25%'

    def _get_performance_label(self, value: float, benchmark: IndustryBenchmark) -> str:
        """Get performance label"""
        if value >= benchmark.percentile_75:
            return 'Excellent'
        elif value >= benchmark.median_value:
            return 'Good'
        elif value >= benchmark.percentile_25:
            return 'Average'
        else:
            return 'Needs Improvement'

    def _get_benchmark_recommendation(self, metric: str, percentile: str) -> str:
        """Get recommendation based on benchmark"""
        if percentile in ['Top 10%', 'Top 25%']:
            return f'✓ {metric} is strong. Maintain current strategy.'
        elif percentile == 'Above Median':
            return f'{metric} is competitive. Small improvements could help.'
        else:
            return f'⚠ {metric} is below industry average. Priority improvement area.'

    def get_all_benchmarks_for_sector(self, sector: str) -> Dict:
        """Get all benchmarks for sector"""
        sector_benchmarks = {}
        metrics = ['CAC', 'LTV', 'Churn', 'Gross_Margin', 'Growth_Rate']

        for metric in metrics:
            benchmark = self.get_benchmark(sector, metric)
            if benchmark:
                sector_benchmarks[metric] = {
                    'median': round(benchmark.median_value, 2),
                    'p25': round(benchmark.percentile_25, 2),
                    'p75': round(benchmark.percentile_75, 2),
                    'p90': round(benchmark.percentile_90, 2)
                }

        return sector_benchmarks

    # ========== MARKET ALERTS ==========

    def add_news_alert(self, sector: str, headline: str, source: str, impact: str):
        """Add market news alert"""
        self.news_alerts.append({
            'id': len(self.news_alerts),
            'sector': sector,
            'headline': headline,
            'source': source,
            'impact': impact,
            'date': datetime.utcnow(),
            'read': False
        })

    def get_news_alerts(self, sector: Optional[str] = None, limit: int = 10) -> List[Dict]:
        """Get news alerts"""
        alerts = self.news_alerts
        if sector:
            alerts = [a for a in alerts if a['sector'].lower() == sector.lower()]

        return sorted(alerts, key=lambda x: x['date'], reverse=True)[:limit]

    # ========== ECONOMIC INDICATORS ==========

    def set_economic_indicator(self, indicator_name: str, value: float):
        """Set economic indicator"""
        self.economic_indicators[indicator_name] = value

    def get_economic_indicators(self) -> Dict[str, float]:
        """Get all economic indicators"""
        return {
            'inflation_rate': self.economic_indicators.get('inflation_rate', 6.2),
            'gdp_growth': self.economic_indicators.get('gdp_growth', 6.5),
            'unemployment_rate': self.economic_indicators.get('unemployment_rate', 4.2),
            'exchange_rate_usd_bdt': self.economic_indicators.get('exchange_rate_usd_bdt', 105.0),
            'mobile_penetration': self.economic_indicators.get('mobile_penetration', 65.0),
            'internet_users_pct': self.economic_indicators.get('internet_users_pct', 52.0)
        }

    def get_market_conditions(self) -> Dict:
        """Get overall market conditions"""
        indicators = self.get_economic_indicators()

        return {
            'overall_sentiment': self._calculate_market_sentiment(indicators),
            'growth_potential': indicators.get('gdp_growth', 0),
            'digital_adoption': indicators.get('internet_users_pct', 0),
            'currency_stability': 'Moderate',
            'investment_climate': 'Improving',
            'key_opportunities': [
                'Digital transformation',
                'Financial inclusion',
                'E-commerce growth',
                'Tech talent availability'
            ]
        }

    def _calculate_market_sentiment(self, indicators: Dict) -> str:
        """Calculate market sentiment"""
        gdp = indicators.get('gdp_growth', 0)
        inflation = indicators.get('inflation_rate', 0)

        if gdp > 6 and inflation < 8:
            return 'Positive'
        elif gdp > 4:
            return 'Neutral'
        else:
            return 'Cautious'


# Global market intelligence service instance
market_intelligence = MarketIntelligenceService()
