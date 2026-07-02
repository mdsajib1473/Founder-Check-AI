from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from models import init_db, get_db, engine, Base, AnalysisRecord, QASession
from sqlalchemy.orm import Session
from schemas import AnalyzeIdeaRequest, AnalysisResult, DemandAnalysis, RegulatoryAnalysis, BusinessCanvas, InvestorQuestion, IdeaExtraction
from llm_flexible import extract_idea_fields, analyze_demand, analyze_regulatory_risks, generate_business_canvas, generate_investor_questions
import os
import json
from datetime import datetime

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

@app.post("/api/v1/analyze", response_model=AnalysisResult)
async def analyze_startup_idea(request: AnalyzeIdeaRequest, db: Session = Depends(get_db)):
    """Full startup idea analysis pipeline"""

    if not request.idea or len(request.idea.strip()) < 10:
        raise HTTPException(status_code=400, detail="Idea must be at least 10 characters")

    try:
        # Step 1: Extract structured fields
        print("[1/5] Extracting idea fields...")
        idea_data = extract_idea_fields(request.idea)

        # Step 2: Analyze demand
        print("[2/5] Analyzing market demand...")
        demand_data = analyze_demand(request.idea, idea_data.get("target_customer", "Unknown"))

        # Step 3: Analyze regulatory risks
        print("[3/5] Analyzing regulatory risks...")
        regulatory_data = analyze_regulatory_risks(request.idea, idea_data.get("sector", "unknown"))

        # Step 4: Generate business canvas
        print("[4/5] Generating business model canvas...")
        canvas_data = generate_business_canvas(request.idea, idea_data.get("sector", "unknown"))

        # Step 5: Generate investor questions
        print("[5/5] Generating investor questions...")
        questions_data = generate_investor_questions(request.idea, idea_data.get("sector", "unknown"))

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

        # Store in database
        print("[6/6] Saving to database...")
        db_idea = StartupIdea(
            title=idea_data.get("title", "Untitled"),
            description=request.idea,
            sector=idea_data.get("sector"),
            target_customer=idea_data.get("target_customer"),
            revenue_model=idea_data.get("revenue_model"),
            location=idea_data.get("location"),
            language=request.language
        )
        db.add(db_idea)
        db.commit()
        db.refresh(db_idea)

        # Store analysis results
        db_analysis = Analysis(
            idea_id=db_idea.id,
            demand_score=demand_data.get("score"),
            regulatory_score=10 - regulatory_data.get("risk_score", 5),
            business_model_score=6.5,
            overall_readiness=response.overall_readiness_score,
            demand_validation=demand_data,
            regulatory_risks=regulatory_data,
            business_canvas=canvas_data,
            investor_questions=questions_data
        )
        # Save to database
        db_record = AnalysisRecord(
            title=idea_data.get("title", "Untitled"),
            idea=request.idea,
            sector=idea_data.get("sector"),
            overall_readiness_score=response.overall_readiness_score,
            demand_score=demand_data.get("score"),
            regulatory_score=10 - regulatory_data.get("risk_score", 5),
            idea_extraction=idea_data,
            demand_analysis=demand_data,
            regulatory_analysis=regulatory_data,
            business_canvas=canvas_data,
            investor_questions=questions_data
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        # Add analysis_id to response
        response_dict = response.dict()
        response_dict["analysis_id"] = db_record.id

        print("[SUCCESS] Analysis complete and saved!")
        return response_dict

    except Exception as e:
        print(f"[ERROR] Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# ============================================================================
# History & Database Endpoints
# ============================================================================

@app.get("/api/v1/analyses")
async def get_analyses(db: Session = Depends(get_db)):
    """Get all analyses (history)"""
    analyses = db.query(AnalysisRecord).order_by(AnalysisRecord.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "sector": a.sector,
            "overall_readiness_score": a.overall_readiness_score,
            "qa_completed": a.qa_completed,
            "created_at": a.created_at.isoformat()
        }
        for a in analyses
    ]


@app.get("/api/v1/analyses/{analysis_id}")
async def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """Get single analysis by ID"""
    analysis = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return {
        "id": analysis.id,
        "title": analysis.title,
        "idea": analysis.idea,
        "overall_readiness_score": analysis.overall_readiness_score,
        "idea_extraction": analysis.idea_extraction,
        "demand_analysis": analysis.demand_analysis,
        "regulatory_analysis": analysis.regulatory_analysis,
        "business_canvas": analysis.business_canvas,
        "investor_questions": analysis.investor_questions,
        "qa_completed": analysis.qa_completed,
        "qa_score": analysis.qa_score,
        "qa_data": analysis.qa_data,
        "created_at": analysis.created_at.isoformat()
    }


# ============================================================================
# Q&A Endpoints
# ============================================================================

@app.post("/api/v1/qa/start/{analysis_id}")
async def start_qa(analysis_id: int, db: Session = Depends(get_db)):
    """Start Q&A session for an analysis"""
    analysis = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Create session
    session = QASession(analysis_id=analysis_id)
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "question_number": 1,
        "total_questions": 10,
        "question": analysis.investor_questions[0]["question"] if analysis.investor_questions else "What is your target market?"
    }


class AnswerRequest(BaseModel):
    session_id: int
    answer: str


@app.post("/api/v1/qa/answer")
async def submit_answer(request: AnswerRequest, db: Session = Depends(get_db)):
    """Submit answer to Q&A question"""
    session = db.query(QASession).filter(QASession.id == request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    analysis = db.query(AnalysisRecord).filter(AnalysisRecord.id == session.analysis_id).first()

    # Score the answer (1-10) using LLM
    from llm_flexible import call_openai
    question = analysis.investor_questions[session.current_question]["question"]

    score_prompt = f"""
    Question: {question}
    Answer: {request.answer}

    Score this answer 1-10 and provide brief investor feedback.
    Return JSON: {{"score": 8, "feedback": "Good point about..."}}
    RETURN ONLY JSON.
    """

    response_text = call_openai(score_prompt, 200)
    try:
        import json
        score_data = json.loads(response_text) if response_text else {"score": 7, "feedback": "Acceptable answer"}
    except:
        score_data = {"score": 7, "feedback": "Acceptable answer"}

    # Store answer
    if not session.answers:
        session.answers = {}
    session.answers[str(session.current_question)] = {
        "answer": request.answer,
        "score": score_data.get("score", 7),
        "feedback": score_data.get("feedback", "")
    }

    # Move to next question
    session.current_question += 1
    session.updated_at = datetime.utcnow()

    # Check if done
    if session.current_question >= 10:
        # Calculate final score
        scores = [v["score"] for v in session.answers.values() if isinstance(v, dict)]
        final_qa_score = sum(scores) / len(scores) if scores else 5
        session.final_score = final_qa_score

        # Update analysis
        analysis.qa_completed = 1
        analysis.qa_score = final_qa_score
        analysis.qa_data = session.answers
        analysis.overall_readiness_score = (analysis.overall_readiness_score + final_qa_score) / 2

    db.commit()
    db.refresh(session)

    if session.current_question >= 10:
        return {
            "completed": True,
            "final_score": session.final_score,
            "readiness_score": analysis.overall_readiness_score
        }
    else:
        next_q = analysis.investor_questions[session.current_question]["question"]
        return {
            "completed": False,
            "question_number": session.current_question + 1,
            "total_questions": 10,
            "last_score": score_data.get("score"),
            "last_feedback": score_data.get("feedback"),
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
