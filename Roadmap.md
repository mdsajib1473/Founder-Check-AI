# FounderCheck AI

Goal for today: fix the app so it runs end to end without crashing, add real authentication, move data to a real Postgres database (Neon), and apply a security baseline, all before recording the video overview for the Data Science Summit showcase.

Decisions locked in:
- Backend stays FastAPI plus SQLAlchemy. No Django rewrite.
- Database host: Neon (Postgres).
- Auth: email and password with JWT, no OAuth.
- Roles: founder and admin.
- Security scope: baseline only (password hashing, JWT, CORS locked down). No rate limiting for now.
- Order of work: bug fixes first, since they affect what the video will show, then auth and database and security.
- Schema: free to redesign clean, no old data needs to survive.
- LLM provider: OpenAI primary (real key confirmed). Anthropic key status unconfirmed, wire it as an optional fallback only, do not block on it.

Work through phases in order. Do not start a phase before the previous one is verified working.

## Phase 0: Environment Setup and Audit (30 to 45 min)

- Confirm `.env` is in place with `DATABASE_URL` pointed at the real Neon connection string (pooled).
- Test the OpenAI key with a small direct call before touching any app code.
- Attempt one direct Anthropic call to check if that key is valid. Record the result either way, do not spend more than a few minutes on this.
- Run the existing backend and frontend as they are right now, confirm the same baseline behavior found earlier (analyze flow works, Financial tab crashes, five tabs are empty, build fails on one TS error).

Exit condition: both servers run locally, and you know for certain which LLM keys are usable.

## Phase 1: Critical Bug Fixes (1.5 to 2 hours)

1. Add a React error boundary around the results tabs so one broken tab never takes down the whole app.
2. Fix the Financial tab crash: either make the frontend tolerant of the placeholder structure from quick analysis, or make sure the extended data is loaded before that tab renders.
3. Wire the frontend to call `/api/v1/analyze/{id}/extended` after the quick analysis completes, so Financial, SWOT, GTM, BD Impact, and Founder Fit tabs get real data instead of empty shells.
4. Fix the TypeScript build error in `ProductValidationDashboard.tsx` (unused `_data`).
5. Confirm `npm run build` passes clean.

Exit condition: full analyze flow works end to end in the browser, all tabs render real data, no console errors, production build succeeds.

## Phase 2: Database Migration to Neon (2 to 2.5 hours)

1. Resolve the duplicate model definitions between `database.py` and `models.py`. Pick one clean schema, drop the other.
2. Point `DATABASE_URL` at Neon and run `alembic upgrade head` (or generate a fresh migration if the existing one does not match the new clean schema).
3. Replace the in-memory `analyses_store` dict in `main.py` with real reads and writes to the database.
4. Restart the backend and confirm history and past analyses survive the restart.
5. Add the analysis run logging described in Agent.md rule 14 (input, scores, timestamp) as part of this same schema work, since it is the same table.

Exit condition: backend restart does not lose data, analyses are stored in Neon, confirmed by checking the Neon SQL Editor.

## Phase 3: Authentication (2 to 2.5 hours)

1. Add a `User` table (email, hashed password, role: founder or admin, created_at).
2. Implement register and login endpoints using JWT (short-lived access token).
3. Hash passwords with bcrypt via passlib, never store plain text.
4. Replace the fake frontend login with real calls to these endpoints.
5. Protect the analyze and history endpoints so they are tied to the logged-in user.
6. Add a minimal way for a user to be marked admin (manual DB flag is fine for today, no need for an admin UI).

Exit condition: registering, logging in, and logging out all work against the real backend, and a logged-in user only sees their own analyses.

## Phase 4: Security Baseline (1 to 1.5 hours)

1. Restrict CORS to the actual frontend origin, remove any wildcard.
2. Confirm no secrets are hardcoded anywhere in the codebase, everything reads from `.env`.
3. Add input validation via Pydantic schemas on the auth endpoints (email format, minimum password length).
4. Sanitize any user-submitted text before it reaches an LLM prompt, per Agent.md rule 12.

Exit condition: no secrets in source, CORS locked down, auth inputs validated.

## Phase 5: Frontend Polish (1 hour)

Apply the frontend design rules from Agent.md (make the readiness score the visual focal point, clean layout, no unnecessary flashiness, gentle reminders for incomplete states). Remove emojis and em dashes from all frontend copy, markdown files, and code comments.

Exit condition: UI looks intentional and calm on camera, no placeholder or crash states visible during a normal walkthrough.

## Phase 6: End to End Testing (45 min to 1 hour)

1. Full flow: register, login, submit an idea, view every tab including the extended ones, complete the Q&A flow, log out.
2. Restart the backend mid-test to confirm persistence holds.
3. Run `npm run build` one final time.
4. Scan backend logs for errors during the full walkthrough.

Exit condition: one clean run through the entire app with zero crashes, zero console errors, zero backend errors.
