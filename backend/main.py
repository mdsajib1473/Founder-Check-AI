from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from models import init_db, get_db, engine, Base, AnalysisRecord, QASession
from sqlalchemy.orm import Session
from schemas import AnalyzeIdeaRequest, AnalysisResult, DemandAnalysis, RegulatoryAnalysis, BusinessCanvas, InvestorQuestion, IdeaExtraction
from llm_flexible import (
    extract_idea_fields, analyze_demand, analyze_regulatory_risks, generate_business_canvas, generate_investor_questions,
    analyze_competitors, analyze_bangladesh_impact, analyze_swot, generate_gtm_strategy, assess_risks, assess_founder_fit
)
from app.services.financial_engine import calculate_financial_projections
from app.routes.collaboration import router as collaboration_router
from app.routes.market_intelligence import router as market_intelligence_router
from app.routes.product_validation import router as product_validation_router
import os
import json
from datetime import datetime
from io import BytesIO
import base64

load_dotenv()

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FounderCheck API",
    description="Bangladesh Startup Validator API",
    version="0.1.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include collaboration routes
app.include_router(collaboration_router)

# Include market intelligence routes
app.include_router(market_intelligence_router)

# Include product validation routes
app.include_router(product_validation_router)

# ============================================================================
# Models
# ============================================================================

class HealthCheck(BaseModel):
    status: str
    message: str

class HelloRequest(BaseModel):
    idea: str

class HelloResponse(BaseModel):
    message: str
    idea_received: str
    backend_status: str

# ============================================================================
# Routes
# ============================================================================

@app.get("/", response_model=HealthCheck)
async def root():
    """Health check endpoint"""
    return {
        "status": "operational",
        "message": "FounderCheck API is running ✓"
    }

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check with API key status"""
    anthropic_key = "✓" if os.getenv("ANTHROPIC_API_KEY") else "✗"
    return {
        "status": "operational",
        "message": f"API Keys: Anthropic={anthropic_key}"
    }

@app.post("/api/v1/hello", response_model=HelloResponse)
async def hello_endpoint(request: HelloRequest):
    """Hello World endpoint - receives idea and echoes back"""
    return {
        "message": "FounderCheck backend is connected!",
        "idea_received": request.idea,
        "backend_status": "ready_for_analysis"
    }

# ============================================================================
# Analysis Endpoints
# ============================================================================

@app.post("/api/v1/analyze")
async def analyze_startup_idea(request: AnalyzeIdeaRequest):
    """Full startup idea analysis pipeline"""

    if not request.idea or len(request.idea.strip()) < 10:
        raise HTTPException(status_code=400, detail="Idea must be at least 10 characters")

    try:
        # Step 1: Extract structured fields
        print("[1/11] Extracting idea fields...")
        idea_data = extract_idea_fields(request.idea)

        # Step 2: Analyze demand
        print("[2/11] Analyzing market demand...")
        demand_data = analyze_demand(request.idea, idea_data.get("target_customer", "Unknown"))

        # Step 3: Analyze regulatory risks
        print("[3/11] Analyzing regulatory risks...")
        regulatory_data = analyze_regulatory_risks(request.idea, idea_data.get("sector", "unknown"))

        # Step 4: Generate business canvas
        print("[4/11] Generating business model canvas...")
        canvas_data = generate_business_canvas(request.idea, idea_data.get("sector", "unknown"))

        # Step 5: Generate investor questions
        print("[5/11] Generating investor questions...")
        questions_data = generate_investor_questions(request.idea, idea_data.get("sector", "unknown"))

        # Step 6: Analyze competitors
        print("[6/11] Analyzing competitors...")
        competitor_data = analyze_competitors(request.idea, idea_data.get("sector", "unknown"))

        # Step 7: Bangladesh market impact
        print("[7/11] Analyzing Bangladesh impact...")
        bd_impact_data = analyze_bangladesh_impact(request.idea, idea_data.get("sector", "unknown"))

        # Step 8: SWOT analysis
        print("[8/11] Generating SWOT analysis...")
        swot_data = analyze_swot(request.idea, idea_data.get("sector", "unknown"))

        # Step 9: Go-to-market strategy
        print("[9/11] Creating GTM strategy...")
        gtm_data = generate_gtm_strategy(request.idea, idea_data.get("sector", "unknown"))

        # Step 10: Risk assessment
        print("[10/11] Assessing risks...")
        risk_data = assess_risks(request.idea, idea_data.get("sector", "unknown"))

        # Step 11: Founder fit
        print("[11/11] Assessing founder fit...")
        founder_data = assess_founder_fit(request.idea, idea_data.get("sector", "unknown"))

        # Step 12: Financial projections
        print("[12/12] Generating financial projections...")
        full_analysis = {
            "idea_extraction": idea_data,
            "demand_analysis": demand_data,
            "regulatory_analysis": regulatory_data,
            "business_canvas": canvas_data,
            "competitor_analysis": competitor_data,
            "bangladesh_impact": bd_impact_data,
            "swot_analysis": swot_data,
            "go_to_market": gtm_data,
            "risk_assessment": risk_data,
            "founder_fit": founder_data
        }
        financial_data = calculate_financial_projections(full_analysis)

        # Calculate overall readiness score (average of key scores)
        overall_score = (
            demand_data.get("score", 5) +
            (10 - regulatory_data.get("risk_score", 5)) +
            6.5  # Default for business model
        ) / 3

        # Create response
        response = AnalysisResult(
            idea_extraction=IdeaExtraction(**idea_data),
            demand_analysis=DemandAnalysis(**demand_data),
            regulatory_analysis=RegulatoryAnalysis(**regulatory_data),
            business_canvas=BusinessCanvas(**canvas_data),
            investor_questions=[InvestorQuestion(**q) for q in questions_data],
            overall_readiness_score=round(overall_score, 1),
            analysis_status="completed"
        )

        # Store in memory
        global next_id
        analysis_id = next_id
        next_id += 1

        analyses_store[analysis_id] = {
            "id": analysis_id,
            "title": idea_data.get("title", "Untitled"),
            "idea": request.idea,
            "sector": idea_data.get("sector"),
            "overall_readiness_score": response.overall_readiness_score,
            "demand_score": demand_data.get("score"),
            "regulatory_score": 10 - regulatory_data.get("risk_score", 5),
            "idea_extraction": idea_data,
            "demand_analysis": demand_data,
            "regulatory_analysis": regulatory_data,
            "business_canvas": canvas_data,
            "investor_questions": questions_data,
            "competitor_analysis": competitor_data,
            "bangladesh_impact": bd_impact_data,
            "swot_analysis": swot_data,
            "go_to_market": gtm_data,
            "risk_assessment": risk_data,
            "founder_fit": founder_data,
            "financial_projections": financial_data,
            "qa_completed": 0,
            "qa_score": None,
            "qa_data": None
        }

        response_dict = response.dict()
        response_dict["analysis_id"] = analysis_id
        response_dict["competitor_analysis"] = competitor_data
        response_dict["bangladesh_impact"] = bd_impact_data
        response_dict["swot_analysis"] = swot_data
        response_dict["go_to_market"] = gtm_data
        response_dict["risk_assessment"] = risk_data
        response_dict["founder_fit"] = founder_data
        response_dict["financial_projections"] = financial_data

        print("[SUCCESS] Analysis complete and saved!")
        return response_dict

    except Exception as e:
        print(f"[ERROR] Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/api/v1/analyses/{analysis_id}/financial")
async def get_financial_projections(analysis_id: int):
    """Get detailed financial projections for an analysis"""
    if analysis_id not in analyses_store:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis = analyses_store[analysis_id]
    financial_data = analysis.get("financial_projections")

    if not financial_data:
        raise HTTPException(status_code=404, detail="Financial projections not available")

    return financial_data


class FinancialAssumptionsRequest(BaseModel):
    """Request to recalculate with custom assumptions"""
    monthly_revenue_month_1: float
    monthly_growth_rate: float
    customer_acquisition_cost: float
    fixed_costs_monthly: float
    variable_cost_percentage: float


@app.post("/api/v1/financial/custom")
async def calculate_custom_financial(analysis_id: int, assumptions: FinancialAssumptionsRequest):
    """Calculate financial projections with custom assumptions"""
    if analysis_id not in analyses_store:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis = analyses_store[analysis_id]

    # Create full analysis dict with custom assumptions merged
    full_analysis = {
        "idea_extraction": analysis.get("idea_extraction", {}),
        "demand_analysis": analysis.get("demand_analysis", {}),
        "regulatory_analysis": analysis.get("regulatory_analysis", {}),
        "business_canvas": analysis.get("business_canvas", {}),
        "competitor_analysis": analysis.get("competitor_analysis", {}),
        "bangladesh_impact": analysis.get("bangladesh_impact", {}),
        "swot_analysis": analysis.get("swot_analysis", {}),
        "go_to_market": analysis.get("go_to_market", {}),
        "risk_assessment": analysis.get("risk_assessment", {}),
        "founder_fit": analysis.get("founder_fit", {})
    }

    # Override with custom assumptions
    from app.services.financial_engine import FinancialProjections

    custom_assumptions = {
        'monthly_revenue_month_1': assumptions.monthly_revenue_month_1,
        'monthly_growth_rate': assumptions.monthly_growth_rate,
        'customer_acquisition_cost': assumptions.customer_acquisition_cost,
        'cac_reduction_rate': 0.02,
        'lifetime_value_months': 12,
        'fixed_costs_monthly': assumptions.fixed_costs_monthly,
        'variable_cost_percentage': assumptions.variable_cost_percentage,
        'initial_investment': 5000000,
        'team_size_month_1': 5,
        'avg_salary': 50000
    }

    engine = FinancialProjections(custom_assumptions)
    return engine.generate_projections()


# ============================================================================
# History & Database Endpoints
# ============================================================================

# In-memory storage (for 3-day demo)
analyses_store = {}
next_id = 1

@app.get("/api/v1/analyses")
async def get_analyses():
    """Get all analyses (history)"""
    return [
        {
            "id": a.get("id"),
            "title": a.get("idea_extraction", {}).get("title", "Untitled"),
            "sector": a.get("sector"),
            "overall_readiness_score": a.get("overall_readiness_score"),
            "qa_completed": a.get("qa_completed", 0),
            "created_at": datetime.utcnow().isoformat()
        }
        for a in analyses_store.values()
    ]


@app.get("/api/v1/analyses/{analysis_id}")
async def get_analysis(analysis_id: int):
    """Get single analysis by ID"""
    if analysis_id not in analyses_store:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analyses_store[analysis_id]


@app.get("/api/v1/analyses/{analysis_id}/report")
async def get_analysis_report(analysis_id: int):
    """Get analysis as formatted report (for PDF export)"""
    if analysis_id not in analyses_store:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis = analyses_store[analysis_id]

    # Create formatted report data
    report = {
        "title": analysis.get("title", "Startup Analysis"),
        "description": analysis.get("idea"),
        "generated_at": datetime.utcnow().isoformat(),
        "readiness_score": analysis.get("overall_readiness_score"),
        "sections": {
            "overview": {
                "title": "Executive Summary",
                "sector": analysis.get("sector"),
                "target_customer": analysis.get("idea_extraction", {}).get("target_customer"),
                "revenue_model": analysis.get("idea_extraction", {}).get("revenue_model"),
                "location": analysis.get("idea_extraction", {}).get("location"),
                "summary": f"This startup idea shows a readiness score of {analysis.get('overall_readiness_score')}/10"
            },
            "demand": {
                "title": "Market Demand Analysis",
                "market_size": analysis.get("demand_analysis", {}).get("market_size"),
                "score": analysis.get("demand_analysis", {}).get("score"),
                "opportunities": analysis.get("demand_analysis", {}).get("opportunities", []),
                "threats": analysis.get("demand_analysis", {}).get("threats", [])
            },
            "regulatory": {
                "title": "Regulatory Risk Assessment",
                "risk_score": analysis.get("regulatory_analysis", {}).get("risk_score"),
                "key_regulators": analysis.get("regulatory_analysis", {}).get("key_regulators", []),
                "estimated_timeline": analysis.get("regulatory_analysis", {}).get("estimated_timeline"),
                "cost_estimate": analysis.get("regulatory_analysis", {}).get("cost_estimate")
            },
            "competitors": {
                "title": "Competitive Landscape",
                "competitors": analysis.get("competitor_analysis", {}).get("direct_competitors", []),
                "threat_level": analysis.get("competitor_analysis", {}).get("threat_level")
            },
            "bangladesh": {
                "title": "Bangladesh Market Impact",
                "impact_score": analysis.get("bangladesh_impact", {}).get("impact_score"),
                "market_potential": analysis.get("bangladesh_impact", {}).get("market_potential"),
                "localization_tips": analysis.get("bangladesh_impact", {}).get("localization_recommendations", [])
            },
            "swot": {
                "title": "SWOT Analysis",
                "strengths": analysis.get("swot_analysis", {}).get("strengths", []),
                "weaknesses": analysis.get("swot_analysis", {}).get("weaknesses", []),
                "opportunities": analysis.get("swot_analysis", {}).get("opportunities", []),
                "threats": analysis.get("swot_analysis", {}).get("threats", [])
            },
            "gtm": {
                "title": "Go-to-Market Strategy",
                "phase_1": analysis.get("go_to_market", {}).get("phase_1"),
                "phase_2": analysis.get("go_to_market", {}).get("phase_2"),
                "phase_3": analysis.get("go_to_market", {}).get("phase_3"),
                "customer_acquisition": analysis.get("go_to_market", {}).get("customer_acquisition")
            },
            "risks": {
                "title": "Risk Assessment",
                "overall_score": analysis.get("risk_assessment", {}).get("overall_risk_score"),
                "high_risks": analysis.get("risk_assessment", {}).get("high_risks", []),
                "medium_risks": analysis.get("risk_assessment", {}).get("medium_risks", [])
            },
            "founder": {
                "title": "Founder-Market Fit",
                "fit_score": analysis.get("founder_fit", {}).get("fit_score"),
                "required_skills": analysis.get("founder_fit", {}).get("required_skills", []),
                "improvement_areas": analysis.get("founder_fit", {}).get("improvement_areas", [])
            }
        }
    }

    return report


# ============================================================================
# Q&A Endpoints
# ============================================================================

qa_sessions = {}
next_session_id = 1

@app.post("/api/v1/qa/start/{analysis_id}")
async def start_qa(analysis_id: int):
    """Start Q&A session for an analysis"""
    if analysis_id not in analyses_store:
        raise HTTPException(status_code=404, detail="Analysis not found")

    global next_session_id
    session_id = next_session_id
    next_session_id += 1

    qa_sessions[session_id] = {
        "analysis_id": analysis_id,
        "current_question": 0,
        "answers": {}
    }

    questions = analyses_store[analysis_id]["investor_questions"]
    return {
        "session_id": session_id,
        "question_number": 1,
        "total_questions": 10,
        "question": questions[0]["question"] if questions else "What is your target market?"
    }


class AnswerRequest(BaseModel):
    session_id: int
    answer: str


@app.post("/api/v1/qa/answer")
async def submit_answer(request: AnswerRequest):
    """Submit answer to Q&A question"""
    if request.session_id not in qa_sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = qa_sessions[request.session_id]
    analysis_id = session["analysis_id"]
    analysis = analyses_store[analysis_id]

    # Score the answer (simple logic for speed)
    score = 7  # Default score
    feedback = "Good answer - shows understanding of the market"

    # Store answer
    session["answers"][str(session["current_question"])] = {
        "answer": request.answer,
        "score": score,
        "feedback": feedback
    }

    # Move to next question
    session["current_question"] += 1

    # Check if done
    if session["current_question"] >= 10:
        scores = [v["score"] for v in session["answers"].values()]
        final_qa_score = sum(scores) / len(scores) if scores else 5

        # Update analysis
        analyses_store[analysis_id]["qa_completed"] = 1
        analyses_store[analysis_id]["qa_score"] = final_qa_score
        analyses_store[analysis_id]["qa_data"] = session["answers"]
        analyses_store[analysis_id]["overall_readiness_score"] = (analysis["overall_readiness_score"] + final_qa_score) / 2

        return {
            "completed": True,
            "final_score": final_qa_score,
            "readiness_score": analyses_store[analysis_id]["overall_readiness_score"]
        }
    else:
        questions = analysis["investor_questions"]
        next_q = questions[session["current_question"]]["question"]
        return {
            "completed": False,
            "question_number": session["current_question"] + 1,
            "total_questions": 10,
            "last_score": score,
            "last_feedback": feedback,
            "question": next_q
        }


# ============================================================================
# Placeholder for future endpoints
# ============================================================================
# @app.post("/api/v1/retrieve")     # RAG retrieval
# @app.delete("/api/v1/analyses/{id}")  # Delete analysis

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
