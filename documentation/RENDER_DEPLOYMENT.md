# Deploying V-Assist on Render

This repo can be deployed on Render as:
- **Backend**: a Python web service (Flask + Gunicorn)
- **Frontend**: a static site (Vite build)

A Render Blueprint file is included at the repo root: `render.yaml`.

## Option A (recommended): Deploy via Blueprint

1. Push this repository to GitHub (Render deploys from a Git repo).
2. In Render, go to **New +** → **Blueprint**.
3. Select your repo and confirm the Blueprint.
4. Render will create and deploy:
   - `vassist-backend` (Python web service)
   - `vassist-frontend` (static site)

### Verify
- Backend health check: `https://vassist-backend.onrender.com/api/health`
- Frontend: `https://vassist-frontend.onrender.com`

## Option B: Deploy services separately (manual)

If you prefer to create a **Web Service** (backend) and a **Static Site** (frontend) manually in Render, use these settings.

### Backend (Web Service)

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn wsgi:app --bind 0.0.0.0:$PORT`
- Health Check Path: `/api/health`
- Environment:
  - `PYTHON_VERSION=3.11.4`
  - `FLASK_ENV=production`
  - `DEBUG=False`
  - `DATABASE_URL=...` (your DB URL; or keep SQLite for quick boot)

### Frontend (Static Site)

- Root Directory: `h/front`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment (build-time):
  - `VITE_API_BASE_URL=https://<your-backend>.onrender.com/api`

Enable SPA routing:
- Add a rewrite rule: `/*` -> `/index.html`

## Environment variables

### Backend (`vassist-backend`)

Blueprint defaults `DATABASE_URL` to SQLite (`sqlite:////tmp/vassist.db`) so the service boots even without provisioning a database.

For a real deployment, use a managed DB (recommended):
- Create a Render Postgres database (or any external DB)
- Set `DATABASE_URL` on the backend service to that connection string
  - This codebase supports both `postgresql://...` and Render-style `postgres://...` URLs.

Other common env vars:
- `CORS_ORIGINS`: must include your frontend URL, e.g. `https://vassist-frontend.onrender.com`
- `SECRET_KEY`, `JWT_SECRET_KEY`: set to strong random values (Blueprint auto-generates them)
- `GOOGLE_GEMINI_API_KEY`: required for `/api/chat/message` when KB does not match
- `OPENAI_API_KEY`: required for `/api/chat/speech-to-text`
- Email (optional): `MAIL_USERNAME`, `MAIL_PASSWORD`, and set `MAIL_SUPPRESS_SEND=False`

Email tips (Render):
- If `/api/auth/forgot-password` hangs or times out, your SMTP connection is likely blocked/unreachable.
- You can tune timeouts:
  - `MAIL_SOCKET_TIMEOUT=10` (per-socket timeout)
  - `MAIL_SEND_TIMEOUT=12` (overall cap per API request)
- Recommended alternative (avoids SMTP): configure Resend (HTTPS)
  - `RESEND_API_KEY=...`
  - `RESEND_FROM_EMAIL=Your App <you@yourdomain.com>`

### Frontend (`vassist-frontend`)

Set at build time:
- `VITE_API_BASE_URL`: the backend API base URL (must include `/api`), e.g.
  - `https://vassist-backend.onrender.com/api`

If you change `VITE_API_BASE_URL`, you must trigger a **new frontend build** (because Vite embeds env vars at build time).

## Notes / limitations

- The admin upload endpoints write knowledge base and timetable files under `backend/data/`.
  - Render’s filesystem is **ephemeral** on free web services; for persistence, use a managed database and/or a persistent disk or external storage.
- Client-side routing is handled by the static site rewrite rule in `render.yaml` (so `/login`, `/dashboard`, etc. work on refresh).
