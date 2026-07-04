"""Authentication helpers: password hashing, JWT issuing, current-user dependency.

Passwords are hashed with bcrypt via passlib and never stored or logged in
plain text. Access tokens are short-lived JWTs signed with JWT_SECRET from
the project .env.
"""
import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from models import get_db, User

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is not set. Configure it in .env.")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Hash a plain-text password with bcrypt."""
    return _pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Check a plain-text password against its bcrypt hash."""
    return _pwd_context.verify(password, hashed)


def create_access_token(user: User) -> str:
    """Issue a short-lived JWT for the given user."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    """FastAPI dependency: resolve the Bearer token to a User or raise 401."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired, please log in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.get(User, int(payload.get("sub", 0)))
    if user is None:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return user


def require_owner_or_admin(record_user_id: int, user: User) -> None:
    """Raise 404 unless the user owns the record or is an admin.

    404 rather than 403 so the API does not leak which analysis ids exist
    to users who do not own them.
    """
    if user.role != "admin" and record_user_id != user.id:
        raise HTTPException(status_code=404, detail="Analysis not found")
