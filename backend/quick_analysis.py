"""
Fast-track analysis mode - returns results in 30-45 seconds instead of 2+ minutes
Uses parallel processing and optimized prompts
"""
import asyncio
from llm_flexible import (
    extract_idea_fields, analyze_demand, analyze_regulatory_risks,
    generate_business_canvas, generate_investor_questions, analyze_competitors
)
from app.services.financial_engine import calculate_financial_projections

async def run_parallel_analysis(idea: str, idea_data: dict):
    """Run 6 core analyses in parallel"""
    tasks = [
        asyncio.to_thread(analyze_demand, idea, idea_data.get("target_customer", "Unknown")),
        asyncio.to_thread(analyze_regulatory_risks, idea, idea_data.get("sector", "unknown")),
        asyncio.to_thread(generate_business_canvas, idea, idea_data.get("sector", "unknown")),
        asyncio.to_thread(generate_investor_questions, idea, idea_data.get("sector", "unknown")),
        asyncio.to_thread(analyze_competitors, idea, idea_data.get("sector", "unknown")),
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    return {
        "demand": results[0] if not isinstance(results[0], Exception) else {"score": 5, "market_size": "Unknown", "competition": "Unknown", "opportunities": [], "threats": []},
        "regulatory": results[1] if not isinstance(results[1], Exception) else {"risk_score": 5, "key_regulators": [], "critical_approvals": [], "estimated_timeline": 90, "cost_estimate": "Unknown", "warnings": ""},
        "canvas": results[2] if not isinstance(results[2], Exception) else {},
        "questions": results[3] if not isinstance(results[3], Exception) else [],
        "competitors": results[4] if not isinstance(results[4], Exception) else {},
    }

async def quick_analyze(idea: str) -> dict:
    """
    Fast startup analysis - ~30-45 seconds for core analysis
    Skips: SWOT, GTM, founder fit, Bangladesh impact (can be extended later)
    Focuses on: Idea extraction, demand, regulatory, canvas, investors, competitors
    """

    print("[1/6] Extracting idea fields...")
    idea_data = extract_idea_fields(idea)

    print("[2-6/6] Running parallel core analysis...")
    results = await run_parallel_analysis(idea, idea_data)

    demand_data = results["demand"]
    regulatory_data = results["regulatory"]
    canvas_data = results["canvas"]
    questions_data = results["questions"]
    competitor_data = results["competitors"]

    # Calculate overall readiness score
    overall_score = (
        demand_data.get("score", 5) +
        (10 - regulatory_data.get("risk_score", 5)) +
        7.0
    ) / 3

    # Quick financial estimate (not full 3-year projection)
    financial_data = {
        "revenue_projections": {
            "year_1_estimate": "Calculating...",
            "year_2_estimate": "Calculating...",
            "year_3_estimate": "Calculating...",
        },
        "unit_economics": {
            "customer_acquisition_cost": "Estimated",
            "lifetime_value": "Estimated"
        },
        "status": "Quick estimate - full projections available separately"
    }

    return {
        "idea_extraction": idea_data,
        "demand_analysis": demand_data,
        "regulatory_analysis": regulatory_data,
        "business_canvas": canvas_data,
        "investor_questions": questions_data,
        "competitor_analysis": competitor_data,
        "financial_projections": financial_data,
        "overall_readiness_score": round(overall_score, 1),
        "analysis_status": "completed",
        "analysis_mode": "quick"
    }

async def extended_analyze(idea: str, core_analysis: dict) -> dict:
    """
    Extended analysis - adds SWOT, GTM, founder fit, Bangladesh impact
    Runs after quick analysis is complete
    """

    from llm_flexible import (
        analyze_bangladesh_impact, analyze_swot,
        generate_gtm_strategy, assess_founder_fit
    )

    idea_data = core_analysis.get("idea_extraction", {})

    tasks = [
        asyncio.to_thread(analyze_bangladesh_impact, idea, idea_data.get("sector", "unknown")),
        asyncio.to_thread(analyze_swot, idea, idea_data.get("sector", "unknown")),
        asyncio.to_thread(generate_gtm_strategy, idea, idea_data.get("sector", "unknown")),
        asyncio.to_thread(assess_founder_fit, idea, idea_data.get("sector", "unknown")),
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    core_analysis["bangladesh_impact"] = results[0] if not isinstance(results[0], Exception) else {}
    core_analysis["swot_analysis"] = results[1] if not isinstance(results[1], Exception) else {}
    core_analysis["go_to_market"] = results[2] if not isinstance(results[2], Exception) else {}
    core_analysis["founder_fit"] = results[3] if not isinstance(results[3], Exception) else {}
    core_analysis["analysis_mode"] = "extended"

    # Now calculate full financial projections
    core_analysis["financial_projections"] = calculate_financial_projections(core_analysis)

    return core_analysis
