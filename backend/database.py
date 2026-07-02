from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

# Use SQLite for development if PostgreSQL not configured
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./foundercheck.db")

# Only use PostgreSQL if explicitly configured
if "postgresql" in DATABASE_URL:
    try:
        engine = create_engine(DATABASE_URL)
    except Exception as e:
        print(f"Warning: PostgreSQL not available, using SQLite instead: {e}")
        DATABASE_URL = "sqlite:///./foundercheck.db"
        engine = create_engine(DATABASE_URL)
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ============================================================================
# Database Models
# ============================================================================

class StartupIdea(Base):
    __tablename__ = "startup_ideas"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    sector = Column(String(100), nullable=True)
    target_customer = Column(String(255), nullable=True)
    revenue_model = Column(String(100), nullable=True)
    location = Column(String(100), nullable=True)
    language = Column(String(20), default="english")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    analysis = relationship("Analysis", back_populates="idea", cascade="all, delete-orphan")
    qa_sessions = relationship("InvestorQASession", back_populates="idea", cascade="all, delete-orphan")


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("startup_ideas.id"), nullable=False)

    # Analysis scores (1-10)
    demand_score = Column(Float, nullable=True)
    regulatory_score = Column(Float, nullable=True)
    business_model_score = Column(Float, nullable=True)
    overall_readiness = Column(Float, nullable=True)

    # Analysis data (stored as JSON)
    demand_validation = Column(JSON, nullable=True)
    regulatory_risks = Column(JSON, nullable=True)
    business_canvas = Column(JSON, nullable=True)
    investor_questions = Column(JSON, nullable=True)
    pivot_suggestions = Column(JSON, nullable=True)

    # Flags
    is_hallucinogenic = Column(Boolean, default=False)
    unverified_claims = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    idea = relationship("StartupIdea", back_populates="analysis")


class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    regulator = Column(String(100), nullable=False)  # e.g., NBR, RJSC, BIDA
    category = Column(String(100), nullable=False)  # e.g., tax, registration, licensing
    sector = Column(String(100), nullable=True)  # e.g., fintech, food, telecom
    description = Column(Text, nullable=False)
    requirements = Column(JSON, nullable=True)  # List of requirements
    fees = Column(JSON, nullable=True)  # Costs/fees if applicable
    source_url = Column(String(500), nullable=True)
    last_verified = Column(DateTime, nullable=True)
    embedding = Column(JSON, nullable=True)  # Vector embedding for RAG

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    sector = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)  # active, defunct, acquired
    description = Column(Text, nullable=True)
    funding = Column(String(100), nullable=True)  # e.g., "Series A $2M"
    lessons_learned = Column(Text, nullable=True)
    source_url = Column(String(500), nullable=True)
    embedding = Column(JSON, nullable=True)  # Vector embedding for RAG

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class InvestorQASession(Base):
    __tablename__ = "investor_qa_sessions"

    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("startup_ideas.id"), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False)

    # Scoring
    base_score = Column(Float, nullable=True)
    qa_adjusted_score = Column(Float, nullable=True)
    final_readiness_score = Column(Float, nullable=True)

    # Session state
    current_question_index = Column(Integer, default=0)
    total_questions = Column(Integer, default=10)
    questions_answered = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)

    # Session data
    qa_data = Column(JSON, nullable=True)  # Full Q&A history

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    idea = relationship("StartupIdea", back_populates="qa_sessions")


# ============================================================================
# Database Initialization
# ============================================================================

def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully")


def get_db():
    """Dependency for FastAPI - returns database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
