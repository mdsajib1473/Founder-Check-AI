"""
Market Intelligence API Routes
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.market_intelligence import market_intelligence

router = APIRouter(prefix="/api/v1", tags=["market-intelligence"])

# ========== SCHEMAS ==========

class BenchmarkComparisonRequest(BaseModel):
    sector: str
    metric: str
    actual_value: float
    company_size: str = "early-stage"

class CompetitorMetricRequest(BaseModel):
    metric: str  # market_share, growth_rate, valuation
    value: float

class NewsAlertRequest(BaseModel):
    sector: str
    headline: str
    source: str
    impact: str  # High, Medium, Low

# ========== MARKET DATA ENDPOINTS ==========

@router.get("/market/overview/{sector}")
async def get_market_overview(sector: str):
    """Get market overview for sector"""
    overview = market_intelligence.get_market_overview(sector)
    if not overview:
        raise HTTPException(status_code=404, detail="Sector not found")
    return overview

@router.get("/market/conditions")
async def get_market_conditions():
    """Get overall market conditions"""
    return market_intelligence.get_market_conditions()

@router.get("/market/indicators")
async def get_economic_indicators():
    """Get economic indicators"""
    return market_intelligence.get_economic_indicators()

# ========== COMPETITOR INTELLIGENCE ==========

@router.get("/competitors/landscape/{sector}")
async def get_competitive_landscape(sector: str):
    """Get competitive landscape"""
    landscape = market_intelligence.get_competitive_landscape(sector)
    return landscape

@router.get("/competitors/{competitor_id}")
async def get_competitor(competitor_id: str):
    """Get competitor details"""
    competitor = market_intelligence.get_competitor(competitor_id)
    if not competitor:
        raise HTTPException(status_code=404, detail="Competitor not found")

    return {
        'id': competitor.competitor_id,
        'name': competitor.name,
        'sector': competitor.sector,
        'founded': competitor.founded_year,
        'funding_raised_m': round(competitor.funding_raised, 1),
        'valuation_m': round(competitor.latest_valuation, 1),
        'market_share_pct': round(competitor.market_share, 1),
        'employees': competitor.employee_count,
        'products': competitor.key_products,
        'strengths': competitor.strengths,
        'weaknesses': competitor.weaknesses,
        'growth_rate': round(competitor.growth_rate, 1),
        'pricing': competitor.price_range
    }

@router.get("/competitors/{competitor_id}/history")
async def get_competitor_history(competitor_id: str):
    """Get competitor historical data"""
    history = market_intelligence.get_competitor_history(competitor_id)
    if not history:
        raise HTTPException(status_code=404, detail="No history found")
    return {
        'competitor_id': competitor_id,
        'history': history
    }

@router.post("/competitors/{competitor_id}/track")
async def track_competitor_metric(competitor_id: str, request: CompetitorMetricRequest):
    """Track competitor metric"""
    success = market_intelligence.track_competitor_metric(
        competitor_id, request.metric, request.value
    )
    if not success:
        raise HTTPException(status_code=400, detail="Failed to track metric")
    return {"status": "tracked"}

@router.get("/competitors/by-sector/{sector}")
async def get_competitors_by_sector(sector: str):
    """Get all competitors in sector"""
    competitors = market_intelligence.get_competitors_by_sector(sector)
    return [
        {
            'id': c.competitor_id,
            'name': c.name,
            'market_share_pct': round(c.market_share, 1),
            'growth_rate': round(c.growth_rate, 1),
            'valuation_m': round(c.latest_valuation, 1)
        }
        for c in sorted(competitors, key=lambda x: x.market_share, reverse=True)
    ]

# ========== INDUSTRY BENCHMARKS ==========

@router.get("/benchmarks/{sector}")
async def get_sector_benchmarks(sector: str):
    """Get all benchmarks for sector"""
    benchmarks = market_intelligence.get_all_benchmarks_for_sector(sector)
    if not benchmarks:
        raise HTTPException(status_code=404, detail="Benchmarks not found")
    return {
        'sector': sector,
        'benchmarks': benchmarks
    }

@router.post("/benchmarks/compare")
async def compare_to_benchmark(request: BenchmarkComparisonRequest):
    """Compare metric to benchmark"""
    comparison = market_intelligence.compare_to_benchmark(
        request.sector,
        request.metric,
        request.actual_value,
        request.company_size
    )
    return comparison

@router.get("/benchmarks/cac/{sector}")
async def get_cac_benchmark(sector: str, company_size: str = "early-stage"):
    """Get CAC benchmark"""
    return market_intelligence.compare_to_benchmark(
        sector, "CAC", 5000, company_size
    )

@router.get("/benchmarks/ltv/{sector}")
async def get_ltv_benchmark(sector: str, company_size: str = "early-stage"):
    """Get LTV benchmark"""
    return market_intelligence.compare_to_benchmark(
        sector, "LTV", 50000, company_size
    )

@router.get("/benchmarks/churn/{sector}")
async def get_churn_benchmark(sector: str, company_size: str = "early-stage"):
    """Get churn rate benchmark"""
    return market_intelligence.compare_to_benchmark(
        sector, "Churn", 5.0, company_size
    )

@router.get("/benchmarks/margin/{sector}")
async def get_margin_benchmark(sector: str, company_size: str = "early-stage"):
    """Get gross margin benchmark"""
    return market_intelligence.compare_to_benchmark(
        sector, "Gross_Margin", 60.0, company_size
    )

@router.get("/benchmarks/growth/{sector}")
async def get_growth_benchmark(sector: str, company_size: str = "early-stage"):
    """Get growth rate benchmark"""
    return market_intelligence.compare_to_benchmark(
        sector, "Growth_Rate", 100.0, company_size
    )

# ========== NEWS & ALERTS ==========

@router.post("/alerts/add")
async def add_news_alert(request: NewsAlertRequest):
    """Add news alert"""
    market_intelligence.add_news_alert(
        request.sector,
        request.headline,
        request.source,
        request.impact
    )
    return {"status": "alert_added"}

@router.get("/alerts")
async def get_alerts(sector: Optional[str] = None, limit: int = Query(10, ge=1, le=50)):
    """Get news alerts"""
    alerts = market_intelligence.get_news_alerts(sector, limit)
    return {
        'alerts': alerts,
        'count': len(alerts)
    }

# ========== MARKET INSIGHTS ==========

@router.get("/insights/market-opportunity/{sector}")
async def get_market_opportunity(sector: str):
    """Get market opportunity assessment"""
    overview = market_intelligence.get_market_overview(sector)
    conditions = market_intelligence.get_market_conditions()
    landscape = market_intelligence.get_competitive_landscape(sector)

    return {
        'sector': sector,
        'market_overview': overview,
        'market_conditions': conditions,
        'competitive_landscape': landscape,
        'overall_opportunity': overview.get('opportunity', 'Unknown')
    }

@router.get("/insights/competitive-position/{sector}/{your_market_share}")
async def get_competitive_position(sector: str, your_market_share: float):
    """Assess competitive position"""
    landscape = market_intelligence.get_competitive_landscape(sector)
    competitors = landscape.get('top_competitors', [])

    your_rank = None
    for i, comp in enumerate(competitors, 1):
        if comp['market_share_pct'] < your_market_share:
            your_rank = i
            break

    if your_rank is None:
        your_rank = len(competitors) + 1

    return {
        'sector': sector,
        'your_market_share': your_market_share,
        'estimated_rank': your_rank,
        'top_competitors': competitors[:3],
        'consolidation': landscape.get('consolidation_level'),
        'competitive_assessment': self._get_position_assessment(your_rank, len(competitors))
    }

def _get_position_assessment(rank: int, total: int) -> str:
    """Get position assessment"""
    if rank <= 2:
        return 'Strong competitive position'
    elif rank <= 5:
        return 'Competitive - room for growth'
    else:
        return 'New entrant - significant opportunity'

@router.get("/insights/growth-potential/{sector}")
async def get_growth_potential(sector: str):
    """Assess growth potential"""
    overview = market_intelligence.get_market_overview(sector)
    benchmarks = market_intelligence.get_all_benchmarks_for_sector(sector)

    return {
        'sector': sector,
        'market_growth_rate': overview.get('annual_growth'),
        'projected_3yr_growth': overview.get('projected_3yr_growth'),
        'tam': overview.get('tam'),
        'sam': overview.get('sam'),
        'som': overview.get('som'),
        'benchmark_growth_rate': benchmarks.get('Growth_Rate', {}).get('median', 0),
        'growth_potential': 'High' if overview.get('annual_growth', 0) > 25 else 'Moderate' if overview.get('annual_growth', 0) > 10 else 'Low',
        'key_trends': overview.get('key_trends', [])
    }

@router.get("/insights/summary/{sector}")
async def get_market_summary(sector: str):
    """Get comprehensive market summary"""
    overview = market_intelligence.get_market_overview(sector)
    conditions = market_intelligence.get_market_conditions()
    landscape = market_intelligence.get_competitive_landscape(sector)
    benchmarks = market_intelligence.get_all_benchmarks_for_sector(sector)

    return {
        'sector': sector,
        'market_size_bn': overview.get('market_size_bn'),
        'annual_growth': overview.get('annual_growth'),
        'market_opportunity': overview.get('opportunity'),
        'competitors': landscape.get('competitor_count'),
        'consolidation': landscape.get('consolidation_level'),
        'market_conditions': conditions.get('overall_sentiment'),
        'key_benchmarks': benchmarks,
        'trends': overview.get('key_trends', []),
        'recommendation': self._get_market_recommendation(overview, landscape, conditions)
    }

def _get_market_recommendation(overview: dict, landscape: dict, conditions: dict) -> str:
    """Get market recommendation"""
    opportunity = overview.get('opportunity', 'Unknown')
    sentiment = conditions.get('overall_sentiment', 'Neutral')

    if opportunity == 'Excellent' and sentiment == 'Positive':
        return 'Highly recommended market for entry'
    elif opportunity in ['Good', 'Excellent']:
        return 'Good opportunity with manageable competition'
    elif opportunity == 'Moderate':
        return 'Moderate opportunity - differentiation critical'
    else:
        return 'Limited opportunity - focus on niche segments'
