from pathlib import Path

from flask import Flask, jsonify, request
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError

from app.database import cors, db, jwt, mail, migrate
from app.models import User  # noqa: F401
from app.routes import register_routes


BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env", override=True)


def create_app(config_class=None):
    if config_class is None:
        from app.config import Config

        config_class = Config

    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    def _normalize_origin(value: str) -> str:
        value = value.strip()
        # Browsers send Origin without a trailing slash, but users often paste URLs with one.
        value = value.rstrip("/")
        return value

    cors_origins = [
        _normalize_origin(origin)
        for origin in app.config["CORS_ORIGINS"].split(",")
        if _normalize_origin(origin)
    ]
    
    # Initialize CORS with explicit configuration
    cors.init_app(
        app, 
        resources={r"/api/*": {"origins": cors_origins}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    @app.before_request
    def handle_preflight():
        """Handle CORS preflight requests"""
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            origin = request.headers.get("Origin", "").rstrip("/")
            
            if origin and (origin in cors_origins or "*" in cors_origins):
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
                response.headers["Access-Control-Allow-Credentials"] = "true"
            
            return response

    @app.after_request
    def add_cors_headers(response):
        """Add CORS headers to all responses"""
        origin = request.headers.get("Origin", "").rstrip("/")
        
        if origin and (origin in cors_origins or "*" in cors_origins):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Vary"] = "Origin"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Authorization,Content-Type"
            response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        
        return response

    with app.app_context():
        try:
            db.create_all()
        except SQLAlchemyError as exc:
            if app.config.get("TESTING") or app.config.get("DEBUG"):
                app.logger.warning(
                    "Database unavailable during startup; skipping db.create_all(). "
                    "Set DATABASE_URL and ensure the DB is running. Error: %s",
                    exc,
                )
            else:
                raise

    register_routes(app)

    @app.get("/")
    def index():
        return jsonify(
            {
                "status": "success",
                "message": "V-Assist backend API",
                "docs": "/api/health",
            }
        )

    @app.get("/api", strict_slashes=False)
    def api_index():
        return jsonify(
            {
                "status": "success",
                "message": "V-Assist API base",
                "health": "/api/health",
            }
        )

    return app
