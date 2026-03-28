# V-Assist Backend

Flask backend for the V-Assist project.

## Quick Start

1. Create and activate a Python virtual environment.
2. Install dependencies from `requirements.txt`.
3. Update `.env` values for your local database and secrets.
4. Run the app with `python run.py`.

## Deploy on Render

- Blueprint: `../render.yaml`
- Guide: `../documentation/RENDER_DEPLOYMENT.md`

## Health Endpoint

- `GET /api/health`

## Structure

- `app/` - app factory, config, routes, and extensions
- `tests/` - backend tests
- `run.py` - local entrypoint
- `wsgi.py` - production entrypoint
