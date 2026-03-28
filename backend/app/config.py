import os
from datetime import timedelta


class Config:
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    TESTING = os.getenv("TESTING", "False").lower() == "true"

    APP_NAME = os.getenv("APP_NAME", "V-Assist")
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")

    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-secret-key")

    _raw_database_url = os.getenv("DATABASE_URL", "")
    # Render (and some other platforms) may provide Postgres URLs as `postgres://...`.
    # SQLAlchemy expects `postgresql://...`.
    if _raw_database_url.startswith("postgres://"):
        _raw_database_url = _raw_database_url.replace("postgres://", "postgresql://", 1)

    # Some providers return MySQL URLs as `mysql://...` which defaults to MySQLdb (mysqlclient).
    # We prefer PyMySQL (pure Python) to avoid native build deps on Render.
    if _raw_database_url.startswith("mysql://"):
        _raw_database_url = _raw_database_url.replace("mysql://", "mysql+pymysql://", 1)

    # Some tools explicitly use `mysql+mysqldb://...` (still mysqlclient/MySQLdb).
    if _raw_database_url.startswith("mysql+mysqldb://"):
        _raw_database_url = _raw_database_url.replace("mysql+mysqldb://", "mysql+pymysql://", 1)

    # MariaDB URLs can also be provided without an explicit driver.
    if _raw_database_url.startswith("mariadb://"):
        _raw_database_url = _raw_database_url.replace("mariadb://", "mariadb+pymysql://", 1)

    SQLALCHEMY_DATABASE_URI = _raw_database_url or "mysql+pymysql://root:password@localhost:3306/v_assist_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "False").lower() == "true"

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 86400))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", 2592000))
    )

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")

    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True").lower() == "true"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", "noreply@v-assist.com")
    MAIL_SUPPRESS_SEND = os.getenv("MAIL_SUPPRESS_SEND", "False").lower() == "true"

    # Flask-Mail uses smtplib without an explicit connect timeout.
    # Set a default socket timeout (seconds) so API requests don't hang
    # indefinitely when SMTP is unreachable in production.
    try:
        MAIL_SOCKET_TIMEOUT = float(os.getenv("MAIL_SOCKET_TIMEOUT", "10"))
    except ValueError:
        MAIL_SOCKET_TIMEOUT = 10.0

    # Maximum time (seconds) to spend attempting to send an email within a
    # single API request. This prevents long-hanging requests when SMTP is
    # blocked/unreachable on the hosting platform.
    try:
        MAIL_SEND_TIMEOUT = float(os.getenv("MAIL_SEND_TIMEOUT", "12"))
    except ValueError:
        MAIL_SEND_TIMEOUT = 12.0

    # Optional: Use an HTTPS email provider instead of SMTP (recommended on
    # platforms where outbound SMTP is blocked or unreliable).
    RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
    RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "")

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    WHISPER_MODEL = os.getenv("WHISPER_MODEL", "whisper-1")
    GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-pro-latest")

    CHAT_RESPONSE_MAX_CHARS = int(os.getenv("CHAT_RESPONSE_MAX_CHARS", "800"))
