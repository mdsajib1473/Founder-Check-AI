# Backend image for Google Cloud Run.
# Build context is the backend/ directory: docker build -t foundercheck-api backend/
FROM python:3.12-slim

# Keep Python output unbuffered (clean Cloud Run logs) and skip .pyc files.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install dependencies first so this layer is cached unless requirements change.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source. .dockerignore keeps .venv, __pycache__, and .env out.
COPY . .

# Run as a non-root user.
RUN useradd --create-home --uid 1000 appuser && chown -R appuser /app
USER appuser

# Cloud Run's default port; informational only, the real port comes from $PORT.
EXPOSE 8080

# Cloud Run injects PORT at runtime. Shell form so ${PORT} expands; the
# :-9001 fallback is only for local `docker run` without PORT set.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-9001}
