# Agent.md, FounderCheck AI

This file is the living spec for any Claude Code session working on this project. Read this before making changes. Follow the current phase in roadmap.md, do not jump ahead.

## 1. Project Context

FounderCheck AI is a full stack AI startup analysis platform built for a Data Science Summit project showcase. Backend is FastAPI plus SQLAlchemy, frontend is Vite plus React. The pipeline takes a startup idea as input, runs it through demand validation, regulatory risk analysis, business model scoring, and produces an overall readiness score, plus deeper extended analysis (financial projections, SWOT, GTM, BD Impact, Founder Fit) and an investor Q&A flow that adjusts the score.

This is a working project with real gaps, not a from scratch build. 168 routes already exist across multiple feature routers (analytics, compliance, education, integrations, localization, monitoring, school, market intel, collaboration, validation, mobile). Do not rebuild what already works.

## 2. Tech Stack Decisions (locked)

- Backend: FastAPI plus SQLAlchemy. No Django rewrite.
- Database: Neon (Postgres), pooled connection string.
- Vector store: Chroma, already wired separately at ./data/chroma_db, used for regulation and competitor embeddings. Do not conflate this with the Postgres application data.
- Auth: email and password with JWT. No OAuth.
- Roles: founder and admin.
- LLM provider: OpenAI primary (key confirmed real). Anthropic key present but unconfirmed, wire as optional fallback only, never block a feature on it being valid.
- Security scope for this pass: password hashing, JWT, CORS lockdown. No rate limiting yet.

## 3. UI and UX Design System

The previous version of this file gave vague, generic guidance (make important things stand out, keep it clean, do not overdo flashiness). That guidance was followed correctly and still produced a result that reads as templated and generic. The problem was never effort, it was that the rules never named a specific, intentional visual identity to build toward. This section replaces that guidance with one.

Do not default to a near-black background with a single bright acid-green accent. That combination is one of the most common patterns AI tools produce when given open-ended styling freedom, and it is why the current UI reads as generic rather than deliberate. Also avoid a warm cream background paired with a terracotta or clay-orange accent, that is an equally common default. Both are legitimate palettes in general, but neither was chosen for this product specifically, so neither should survive a real redesign.

Ground every choice in what this product actually is: a rigorous, honest diligence report for a founder, closer in spirit to a financial ledger or an audit document than a consumer app dashboard. The visual identity should feel like a serious assessment a person can trust, not a flashy demo.

Before writing any component code, produce a short design plan and share it for review:

Color, four to six named colors with hex values, one deep structural base, one accent used sparingly and only for the single most important number or action on a screen, one or two muted functional colors for status only (risk levels, warnings), never used decoratively.

Type, a display face used only for the readiness score and section headers, a body face for everything else, and a monospace or tabular face for numbers and data tables so financial figures and scores read with precision. Two or three roles maximum, paired deliberately, not the default that would appear on any other project.

Layout, an 8 pixel base spacing scale, a single consistent corner radius, and a card treatment that uses a thin hairline border rather than a glow or heavy shadow.

Signature, one element on the page that is the deliberate, bold moment, most naturally the readiness score itself, rendered as a real crafted gauge rather than a generic donut chart. Everything else on the page stays quiet and disciplined so that element stands out.

Motion, minimal and purposeful only. A single load-in animation on the score is enough. No hover glows, no scale-up effects, no gradients that move.

After the plan, critique it honestly against what a generic AI-styled app would produce for the same brief. If any part of the plan is the default answer rather than a choice made for this specific product, revise it and say what changed and why. Only then start writing code.

Interface copy follows the same intentionality as color and spacing. Use active voice and name things by what the founder controls, not by internal system terms. Error and empty states explain what happened and what to do next, in a calm and direct voice, never vague and never apologetic. This applies everywhere: buttons, empty states, loading states, and error messages.

Hold a quality floor regardless of how minimal or bold the direction ends up being: visible keyboard focus on every interactive element, layouts that hold up down to mobile width, and reduced motion respected. Take a screenshot of the result and look at it honestly before considering the work done. If it could be mistaken for a template, it is not finished.

## 4. Engineering and Process Rules

1. Never build beyond the current step.
2. Always respond in the same language the user typed (Bangla to Bangla).
3. Every analysis result must include a disclaimer: "This is an AI-generated startup assessment for exploration and learning, not investment advice or a guarantee of outcome."
4. Do not commit and push code. I will do it manually after testing. Ask if pushing is mandatory.
5. Write clean, well-commented code. Every function and class must have a docstring.
6. Follow secure coding practices. Never expose secrets, always validate and sanitize user input before processing, and enforce CORS and CSRF protections appropriate to the endpoint.
7. Write scalable code. Keep business logic in services, keep routes thin, never hardcode values that belong in settings or .env.
8. Do not over-comment. Only comment where the code is not self-explanatory. Avoid stating the obvious.
9. Never let the scoring engine output a fabricated number when the underlying LLM call fails or returns incomplete data. Default to a clearly labeled Incomplete or Calculating state, never a guessed score.
10. Always show the user which factors drove a score (demand, regulatory, business model, and so on), not just a bare number. No black box scoring.
11. Respect free-tier API limits. Cache LLM responses for identical or near-identical inputs in Postgres so repeated demo runs do not burn quota during judging.
12. Treat all user-submitted text as untrusted. Never pass raw, unsanitized input directly into an LLM prompt. Clean it first.
13. Keep idea extraction, scoring, and Q&A adjustment as separate, independently testable service functions. Never merge pipeline stages into one function, even for speed.
14. Log every analysis run (input, scores, timestamp) to the database for traceability.
15. Never let an LLM call fail silently. Catch the error, fall back to the next configured provider before surfacing any error to the user.
16. No emojis and no em dashes anywhere: code comments, markdown files, and all frontend copy. Use plain punctuation only.

## 5. Known Issues to Fix

- Financial engine currently returns similar projections regardless of the specific idea, it relies on generic assumptions rather than idea-specific ones.
- Risk assessment tab is not wired into the pipeline, assess_risks exists in the backend but nothing calls it, the tab shows an honest pending state instead.
- The 168 mock feature routes (collaboration, market intel, school, calendar, API access, and so on) serve placeholder data and remain out of scope, do not treat bugs in these as priority unless explicitly asked.

## 6. Environment

- Backend runs on port 9001. Frontend reads the backend URL from VITE_API_URL, with a localhost:9001 fallback for local development.
- Frontend runs on port 5173.
- .env holds OPENAI_API_KEY, ANTHROPIC_API_KEY, DATABASE_URL (Neon), CHROMA_DB_PATH, JWT_SECRET, and related config. Never hardcode any of these values in source.

## 7. Working Style

- One person (Sajib) is executing this solo with Claude Code. No task division needed in this file.
- Document first, then build. Confirm each phase in roadmap.md before moving to the next.
- Manual git control only, Claude does not commit or push.