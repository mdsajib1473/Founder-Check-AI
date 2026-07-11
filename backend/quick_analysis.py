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

    # Per project rule 9: if a core analysis fails, surface the failure
    # instead of substituting made-up scores that look like real results.
    for result in results:
        if isinstance(result, Exception):
            raise result

    return {
        "demand": results[0],
        "regulatory": results[1],
        "canvas": results[2],
        "questions": results[3],
        "competitors": results[4],
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

    # Overall readiness averages three real, higher-is-better factors:
    # demand, regulatory health (10 - risk), and business model viability.
    # The viability score is now computed by the canvas LLM call, not a
    # hardcoded constant. If any factor is missing or out of range, the
    # score is left as None (honest incomplete) rather than guessed (rule 9).
    def _valid(v):
        return isinstance(v, (int, float)) and 1 <= v <= 10

    demand_score = demand_data.get("score")
    regulatory_risk = regulatory_data.get("risk_score")
    business_viability = canvas_data.get("viability_score")

    if _valid(demand_score) and _valid(regulatory_risk) and _valid(business_viability):
        overall_score = round(
            (demand_score + (10 - regulatory_risk) + business_viability) / 3, 1
        )
    else:
        overall_score = None

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
        "overall_readiness_score": overall_score,
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
        generate_gtm_strategy, assess_founder_fit, assess_risks
    )

    idea_data = core_analysis.get("idea_extraction", {})
    sector = idea_data.get("sector", "unknown")

    # Each extended section is its own independently testable service call
    # (rule 13). A failed section is stored as {} so the frontend shows an
    # honest "not available" state instead of a fabricated result (rule 9).
    tasks = [
        asyncio.to_thread(analyze_bangladesh_impact, idea, sector),
        asyncio.to_thread(analyze_swot, idea, sector),
        asyncio.to_thread(generate_gtm_strategy, idea, sector),
        asyncio.to_thread(assess_founder_fit, idea, sector),
        asyncio.to_thread(assess_risks, idea, sector),
    ]

    results = await asyncio.gather(*tasks, return_exceptions=True)

    core_analysis["bangladesh_impact"] = results[0] if not isinstance(results[0], Exception) else {}
    core_analysis["swot_analysis"] = results[1] if not isinstance(results[1], Exception) else {}
    core_analysis["go_to_market"] = results[2] if not isinstance(results[2], Exception) else {}
    core_analysis["founder_fit"] = results[3] if not isinstance(results[3], Exception) else {}
    core_analysis["risk_assessment"] = results[4] if not isinstance(results[4], Exception) else {}
    core_analysis["analysis_mode"] = "extended"

    # Now calculate full financial projections
    core_analysis["financial_projections"] = calculate_financial_projections(core_analysis)

    return core_analysis
