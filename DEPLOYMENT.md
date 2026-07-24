# PhishGuard AI Deployment

## Render Backend

Use these settings for the `backend` service:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Set these environment variables in Render:

- `ALLOWED_ORIGINS`: your Vercel URL, for example `https://your-vercel-app.vercel.app`
- `SECRET_KEY`: a long random secret. `JWT_SECRET` is also supported for compatibility.
- `GOOGLE_REDIRECT_URI`: `https://your-render-backend.onrender.com/api/v1/auth/callback`
- `DATABASE_URL`: optional, but recommended for production if you use PostgreSQL.
- `GEMINI_API_KEY`, `VT_API_KEY`, `SMTP_USER`, `SMTP_PASSWORD`, and Google OAuth keys as needed.

## Vercel Frontend

Use these settings for the `frontend` project:

- Root directory: `frontend`
- Build command: `npm run build`
- Output: Next.js default

Set this environment variable in Vercel:

- `NEXT_PUBLIC_API_URL`: your Render backend URL, for example `https://your-render-backend.onrender.com`

Redeploy both services after changing environment variables.
