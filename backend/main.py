from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
from models import get_db, AnalysisRecord, QASession, User
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_owner_or_admin
)
from sqlalchemy.orm import Session
from schemas import AnalyzeIdeaRequest, AnalysisResult, DemandAnalysis, RegulatoryAnalysis, BusinessCanvas, InvestorQuestion, IdeaExtraction
from llm_flexible import (
    extract_idea_fields, analyze_demand, analyze_regulatory_risks, generate_business_canvas, generate_investor_questions,
    analyze_competitors, analyze_bangladesh_impact, analyze_swot, generate_gtm_strategy, assess_risks, assess_founder_fit,
    score_investor_answer, LLMUnavailableError
)
import asyncio
from app.services.financial_engine import calculate_financial_projections
from app.routes.collaboration import router as collaboration_router
from app.routes.market_intelligence import router as market_intelligence_router
from app.routes.product_validation import router as product_validation_router
from app.routes.platform_integrations import router as platform_integrations_router
from app.routes.education_resources import router as education_resources_router
from app.routes.startup_school import router as startup_school_router
from app.routes.compliance_legal import router as compliance_legal_router
from app.routes.advanced_analytics import router as advanced_analytics_router
from app.routes.mobile_offline import router as mobile_offline_router
from app.routes.localization import router as localization_router
from app.routes.continuous_monitoring import router as continuous_monitoring_router
import os
import json
from datetime import datetime
from io import BytesIO
import base64

load_dotenv()

# Database schema is managed by Alembic (alembic upgrade head), not create_all.

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

# Include platform integrations routes
app.include_router(platform_integrations_router)

# Include education resources routes
app.include_router(education_resources_router)

# Include startup school routes
app.include_router(startup_school_router)

# Include compliance & legal routes
app.include_router(compliance_legal_router)

# Include advanced analytics routes
app.include_router(advanced_analytics_router)

# Include mobile & offline routes
app.include_router(mobile_offline_router)

# Include localization routes
app.include_router(localization_router)

# Include continuous monitoring routes
app.include_router(continuous_monitoring_router)

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
# Auth Endpoints
# ============================================================================

class RegisterRequest(BaseModel):
    """Registration payload. Email format and minimum password length enforced."""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    """Login payload."""
    email: EmailStr
    password: str


@app.post("/api/v1/auth/register")
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Create a user account and return an access token (auto-login)."""
    email = request.email.lower().strip()
    if db.query(User).filter(User.email == email).first() is not None:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    user = User(email=email, hashed_password=hash_password(request.password), role="founder")
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": {"email": user.email, "role": user.role},
    }


@app.post("/api/v1/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Verify credentials and return an access token."""
    email = request.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()
    # Same error for unknown email and wrong password, no account probing
    if user is None or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": {"email": user.email, "role": user.role},
    }


@app.get("/api/v1/auth/me")
async def get_me(user: User = Depends(get_current_user)):
    """Return the logged-in user's profile (used for session restore)."""
    return {"email": user.email, "role": user.role}


# ============================================================================
# Analysis Endpoints
# ============================================================================

@app.post("/api/v1/analyze")
async def analyze_startup_idea(request: AnalyzeIdeaRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Fast startup idea analysis - returns in 30-45 seconds.

    Persists every run to the analyses table (input, scores, timestamp)
    per project rule 14.
    """

    if not request.idea or len(request.idea.strip()) < 10:
        raise HTTPException(status_code=400, detail="Idea must be at least 10 characters")

    try:
        from quick_analysis import quick_analyze

        print("[QUICK ANALYSIS] Starting fast-track analysis...")
        analysis_dict = await quick_analyze(request.idea)

        risk_score = analysis_dict["regulatory_analysis"].get("risk_score")
        record = AnalysisRecord(
            user_id=user.id,
            title=analysis_dict["idea_extraction"].get("title", "Untitled"),
            idea=request.idea,
            sector=analysis_dict["idea_extraction"].get("sector"),
            overall_readiness_score=analysis_dict.get("overall_readiness_score"),
            demand_score=analysis_dict["demand_analysis"].get("score"),
            regulatory_score=(10 - risk_score) if isinstance(risk_score, (int, float)) else None,
            analysis_mode=analysis_dict.get("analysis_mode", "quick"),
            # Copy so the column value never aliases analysis_dict; a later
            # in-place mutation of an aliased dict would defeat SQLAlchemy's
            # change detection and silently skip the UPDATE.
            result=dict(analysis_dict),
        )
        db.add(record)
        db.flush()  # assigns record.id before commit

        analysis_dict["analysis_id"] = record.id
        record.result = dict(analysis_dict)
        db.commit()

        print(f"[SUCCESS] Quick analysis complete, stored as analysis {record.id}")
        print(f"[INFO] Extended analysis available via /api/v1/analyze/{record.id}/extended")
        return analysis_dict

    except LLMUnavailableError as e:
        db.rollback()
        print(f"[ERROR] Analysis unavailable, all LLM providers failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Analysis unavailable: the AI providers could not be reached. Please try again later.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/v1/analyze/{analysis_id}/extended")
async def get_extended_analysis(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get extended analysis (SWOT, GTM, Founder Fit, Bangladesh Impact) - adds 30-45 seconds"""

    record = db.get(AnalysisRecord, analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    require_owner_or_admin(record.user_id, user)

    try:
        from quick_analysis import extended_analyze

        print(f"[EXTENDED] Starting extended analysis for ID {analysis_id}...")
        core_analysis = dict(record.result or {})
        extended_result = await extended_analyze(record.idea, core_analysis)

        record.result = dict(extended_result)
        record.analysis_mode = "extended"
        db.commit()

        print(f"[SUCCESS] Extended analysis complete!")
        return extended_result

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Extended analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Extended analysis failed: {str(e)}")


@app.get("/api/v1/analyses/{analysis_id}/financial")
async def get_financial_projections(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get detailed financial projections for an analysis"""
    record = db.get(AnalysisRecord, analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    require_owner_or_admin(record.user_id, user)

    financial_data = (record.result or {}).get("financial_projections")
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
async def calculate_custom_financial(analysis_id: int, assumptions: FinancialAssumptionsRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Calculate financial projections with custom assumptions"""
    record = db.get(AnalysisRecord, analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    require_owner_or_admin(record.user_id, user)

    analysis = record.result or {}

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

@app.get("/api/v1/analyses")
async def get_analyses(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get the logged-in user's analyses (admins see all)"""
    query = db.query(AnalysisRecord)
    if user.role != "admin":
        query = query.filter(AnalysisRecord.user_id == user.id)
    records = query.order_by(AnalysisRecord.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "sector": r.sector,
            "overall_readiness_score": r.overall_readiness_score,
            "qa_completed": 1 if r.qa_completed else 0,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in records
    ]


@app.get("/api/v1/analyses/{analysis_id}")
async def get_analysis(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get single analysis by ID (owner or admin only)"""
    record = db.get(AnalysisRecord, analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    require_owner_or_admin(record.user_id, user)
    result = dict(record.result or {})
    result["analysis_id"] = record.id
    return result


@app.get("/api/v1/analyses/{analysis_id}/report")
async def get_analysis_report(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Get analysis as formatted report (for PDF export)"""
    record = db.get(AnalysisRecord, analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    require_owner_or_admin(record.user_id, user)

    # Column metadata plus the stored payload, shaped like the old store dict
    analysis = {"title": record.title, "idea": record.idea, "sector": record.sector, **(record.result or {})}

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

@app.post("/api/v1/qa/start/{analysis_id}")
async def start_qa(analysis_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Start Q&A session for an analysis (owner or admin only)"""
    record = db.get(AnalysisRecord, analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    require_owner_or_admin(record.user_id, user)

    session = QASession(analysis_id=analysis_id, current_question=0, answers={})
    db.add(session)
    db.commit()
    db.refresh(session)

    questions = (record.result or {}).get("investor_questions") or []
    return {
        "session_id": session.id,
        "question_number": 1,
        "total_questions": 10,
        "question": questions[0]["question"] if questions else "What is your target market?"
    }


class AnswerRequest(BaseModel):
    session_id: int
    answer: str


@app.post("/api/v1/qa/answer")
async def submit_answer(request: AnswerRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Submit answer to Q&A question (owner or admin only)"""
    session = db.get(QASession, request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    record = db.get(AnalysisRecord, session.analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    require_owner_or_admin(record.user_id, user)

    questions = (record.result or {}).get("investor_questions") or []
    question_index = session.current_question
    question_text = questions[question_index]["question"] if question_index < len(questions) else ""

    # Score the answer with the LLM. On failure, store an honest unscored
    # state (rule 9) rather than a fabricated number.
    try:
        scoring = await asyncio.to_thread(score_investor_answer, question_text, request.answer, record.idea)
        score = scoring["score"]
        feedback = scoring["feedback"]
    except LLMUnavailableError as e:
        print(f"[QA] Answer scoring unavailable: {str(e)[:200]}")
        score = None
        feedback = "This answer could not be scored (AI provider unavailable). It does not count toward your Q&A score."

    # Reassign the JSON column so SQLAlchemy detects the change
    answers = dict(session.answers or {})
    answers[str(session.current_question)] = {
        "answer": request.answer,
        "score": score,
        "feedback": feedback
    }
    session.answers = answers
    session.current_question += 1

    # Check if done
    if session.current_question >= 10:
        # Average only the answers that were actually scored
        scores = [v["score"] for v in answers.values() if isinstance(v.get("score"), (int, float))]
        final_qa_score = round(sum(scores) / len(scores), 1) if scores else None

        session.completed = True
        session.final_score = final_qa_score

        if final_qa_score is not None:
            record.qa_completed = True
            record.qa_score = final_qa_score
            base_score = record.overall_readiness_score if record.overall_readiness_score is not None else final_qa_score
            record.overall_readiness_score = round((base_score + final_qa_score) / 2, 1)

            result = dict(record.result or {})
            result["qa_completed"] = 1
            result["qa_score"] = final_qa_score
            result["qa_data"] = answers
            result["overall_readiness_score"] = record.overall_readiness_score
            record.result = result

        db.commit()

        return {
            "completed": True,
            "final_score": final_qa_score,
            "readiness_score": record.overall_readiness_score
        }
    else:
        db.commit()
        index = session.current_question
        next_q = questions[index]["question"] if index < len(questions) else "What is your growth plan?"
        return {
            "completed": False,
            "question_number": index + 1,
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
