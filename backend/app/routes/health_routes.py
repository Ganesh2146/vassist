from flask import Blueprint, current_app, jsonify


health_routes = Blueprint("health_routes", __name__)


@health_routes.get("/health")
def health_check():
    return jsonify(
        {
            "status": "success",
            "message": "Backend is running",
            "data": {
                "app_name": current_app.config.get("APP_NAME", "V-Assist"),
                "version": current_app.config.get("APP_VERSION", "1.0.0"),
                "environment": current_app.config.get("FLASK_ENV", "development"),
            },
        }
    ), 200
