from sqlalchemy import create_engine, text, Column, Integer, String, Text, DateTime, JSON, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Configure it in .env. "
        "Refusing to start with an implicit local database."
    )

# pool_pre_ping revalidates pooled connections, which Neon can drop when idle
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)

# Fail fast and loud: a broken database configuration must stop startup,
# never silently fall back to another database.
try:
    with engine.connect() as _conn:
        _conn.execute(text("SELECT 1"))
    print(f"[DB] Connected: {engine.url.render_as_string(hide_password=True)}")
except Exception as e:
    raise RuntimeError(
        f"[DB] Could not connect to {engine.url.render_as_string(hide_password=True)}: {e}"
    ) from e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ============================================================================
# Models
# ============================================================================

class User(Base):
    """Registered user. Role is founder or admin; admin is set manually in the DB."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="founder")  # founder | admin
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalysisRecord(Base):
    """One row per analysis run.

    Also serves as the audit log required by project rule 14: the raw
    input, the factor scores that drove the result, and timestamps are
    all queryable columns. The full payload lives in the result JSON.
    """
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    idea = Column(Text, nullable=False)
    sector = Column(String(100), nullable=True)

    # Factor scores kept as columns so score provenance stays queryable.
    # Nullable on purpose: null means incomplete, never a fabricated value.
    overall_readiness_score = Column(Float, nullable=True)
    demand_score = Column(Float, nullable=True)
    regulatory_score = Column(Float, nullable=True)

    analysis_mode = Column(String(20), nullable=False, default="quick")
    result = Column(JSON, nullable=False)

    qa_completed = Column(Boolean, nullable=False, default=False)
    qa_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class QASession(Base):
    """Investor Q&A session state for one analysis."""
    __tablename__ = "qa_sessions"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(
        Integer,
        ForeignKey("analyses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    current_question = Column(Integer, nullable=False, default=0)
    answers = Column(JSON, nullable=False, default=dict)
    final_score = Column(Float, nullable=True)
    completed = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LLMCache(Base):
    """Cached LLM responses keyed by prompt hash (project rule 11).

    The table exists now so enabling the cache later needs no migration.
    Nothing writes to it yet.
    """
    __tablename__ = "llm_cache"

    id = Column(Integer, primary_key=True)
    prompt_hash = Column(String(64), unique=True, nullable=False, index=True)
    response = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    """Create all tables. Alembic owns schema in normal operation; this
    exists for throwaway local databases only."""
    Base.metadata.create_all(bind=engine)
    print("[DB] Tables created")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
