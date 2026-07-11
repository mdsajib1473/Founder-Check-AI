# FounderCheck - AI-Powered Startup Validator

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-412991?style=flat-square&logo=openai&logoColor=white)

## Live Demo
https://founder-check-ai-ivory.vercel.app

## Overview

FounderCheck is an AI-powered startup validation platform built for entrepreneurs in Bangladesh. A founder describes a startup idea in plain language, and the platform runs it through demand validation, regulatory risk analysis, and business model scoring to produce an overall readiness score, along with deeper analysis covering financial projections, SWOT, go-to-market planning, and founder fit. A separate investor Q&A module lets founders practice answering investor-style questions, with each answer scored on relevance and specificity rather than a fixed number.

## Key Features

### Core Analysis Pipeline
- **Idea Extraction** - Automatic business concept classification
- **Market Demand Analysis** - Market opportunity scoring
- **Regulatory Risk Assessment** - Bangladesh-focused regulatory framing
- **Business Model Canvas** - Structured business validation
- **Extended Analysis** - Financial projections, SWOT, go-to-market plan, and founder fit, generated per idea
- **Investor Q&A Practice** - Answers scored on relevance and specificity, verified to distinguish strong, weak, and off-topic responses
- **PDF Export** - Generates a labeled, idea-specific report with no fabricated values

### Authentication and Data
- Email and password authentication with JWT, verified data isolation between users
- Persistent storage in Postgres (Neon), confirmed to survive backend restarts

### Additional Modules (early stage)
The project also includes a number of additional feature areas (market intelligence, team collaboration, platform integrations, compliance and legal resources, analytics, mobile support, and others) built earlier in development. These currently serve placeholder or mock data and are not yet part of the tested, verified core flow above. They are included as a foundation for future work rather than finished features.

---

## Screenshots
Screenshots will be added here.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- OpenAI API key

### Installation

```bash
# Clone and setup
cd FounderCheck

# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

### Configuration

Edit `.env`:
```env
OPENAI_API_KEY=sk-proj-your-key-here
BACKEND_PORT=9001
VITE_API_URL=http://localhost:9001
LLM_PROVIDER=openai
```

### Run Project

```bash
# Terminal 1 - Backend (port 9001)
cd backend && python main.py

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

**Access:** http://localhost:5173

---

## Architecture

### Technology Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** FastAPI + Python 3.12
- **AI/ML:** OpenAI GPT-3.5-turbo
- **Database:** PostgreSQL (Neon), no local database fallback
- **Export:** PDF generation with a text-based rendering engine

### Verified Facts
| Metric | Value |
|--------|-------|
| Core analysis pipeline | Idea extraction, demand, regulatory risk, business model scoring |
| Extended analysis | Financial projections, SWOT, go-to-market, founder fit |
| User roles | 2 (founder, admin) |
| Language | English |
| Region | Bangladesh |
| Registered backend routes | 168, a subset are the additional early-stage modules noted above |

---

## Use Cases

- Pre-launch startup validation for first-time founders
- Investor pitch preparation and practice
- Market opportunity and regulatory risk assessment

---

## Roadmap

- Sourced, citable regulatory and market data instead of purely AI-generated figures
- Bangla language mode for the analysis output

---

## Security

- CORS restricted to a specific frontend origin
- JWT-based authentication with bcrypt password hashing
- Per-user data isolation, verified against cross-user access attempts
- Input validation and sanitization before any data reaches an LLM prompt

---

## Support

**Backend Check:**
```bash
curl http://localhost:9001/health
```

**Frontend Access:**
```
http://localhost:5173
```

---

## Documentation

See `DEVELOPMENT_STEPS.md` for the complete development journey and implementation details.

---

**FounderCheck** | July 2026

Built to give first-time founders in Bangladesh honest, structured startup feedback.
