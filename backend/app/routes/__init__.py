from app.routes.auth_routes import auth_routes
from app.routes.admin_routes import admin_routes
from app.routes.chat_routes import chat_routes
from app.routes.health_routes import health_routes
from app.routes.dashboard_routes import dashboard_routes
from app.routes.care_routes import care_routes
from app.routes.conversation_routes import conversation_routes


def register_routes(app):
    app.register_blueprint(auth_routes, url_prefix="/api")
    app.register_blueprint(admin_routes, url_prefix="/api")
    app.register_blueprint(chat_routes, url_prefix="/api")
    app.register_blueprint(conversation_routes, url_prefix="/api")
    app.register_blueprint(health_routes, url_prefix="/api")
    app.register_blueprint(dashboard_routes, url_prefix="/api")
    app.register_blueprint(care_routes, url_prefix="/api")
