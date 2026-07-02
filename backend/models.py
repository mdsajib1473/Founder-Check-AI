from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./foundercheck.db")

# Use SQLite for development if PostgreSQL not available
try:
    if "postgresql" in DATABASE_URL:
        import psycopg2  # Check if available
        engine = create_engine(DATABASE_URL)
    else:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
except:
    print("[DB] PostgreSQL unavailable, using SQLite")
    DATABASE_URL = "sqlite:///./foundercheck.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ============================================================================
# Models
# ============================================================================

class AnalysisRecord(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    idea = Column(Text, nullable=False)
    sector = Column(String(100), nullable=True)

    # Scores
    overall_readiness_score = Column(Float, default=0.0)
    demand_score = Column(Float, nullable=True)
    regulatory_score = Column(Float, nullable=True)

    # Full analysis data (JSON)
    idea_extraction = Column(JSON, nullable=True)
    demand_analysis = Column(JSON, nullable=True)
    regulatory_analysis = Column(JSON, nullable=True)
    business_canvas = Column(JSON, nullable=True)
    investor_questions = Column(JSON, nullable=True)

    # Q&A Results
    qa_completed = Column(Integer, default=0)  # 0 = not done, 1 = done
    qa_score = Column(Float, nullable=True)
    qa_data = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class QASession(Base):
    __tablename__ = "qa_sessions"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, nullable=False, index=True)

    current_question = Column(Integer, default=0)  # 0-9
    answers = Column(JSON, default={})  # {0: {"answer": "...", "score": 8, "feedback": "..."}, ...}

    final_score = Column(Float, nullable=True)
    readiness_adjustment = Column(Float, default=0.0)  # Adjusted by Q&A

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
