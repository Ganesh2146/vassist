# Configuration & Deployment Guide - V-Assist

## 1. ENVIRONMENT CONFIGURATION

### 1.1 Development Environment

**Backend `.env` (Development):**
```env
# Flask Settings
FLASK_ENV=development
DEBUG=True
TESTING=False
SECRET_KEY=dev-secret-key-change-in-production

# Database
DATABASE_URL=mysql+pymysql://v_assist:SecurePassword123!@localhost:3306/v_assist_db
SQLALCHEMY_ECHO=True

# JWT
JWT_SECRET_KEY=dev-jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRES=86400

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Email (Optional, use dummy service)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=test@gmail.com
MAIL_PASSWORD=test-password

# Logging
LOG_LEVEL=DEBUG
LOG_FILE=logs/app.log

# API Keys (Optional)
OPENAI_API_KEY=sk-test-key
```

**Frontend `.env` (Development):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=V-Assist
VITE_VOICE_ENABLED=true
VITE_DEFAULT_LANGUAGE=en
VITE_LOG_LEVEL=debug
```

---

### 1.2 Testing Environment

**Backend `.env.test`:**
```env
FLASK_ENV=testing
DEBUG=True
TESTING=True
SECRET_KEY=test-secret-key

# Use test database
DATABASE_URL=mysql+pymysql://v_assist:password@localhost:3306/v_assist_test_db

# Disable email
MAIL_SUPPRESS_SEND=True

# No external API calls
OPENAI_API_KEY=
```

---

### 1.3 Production Environment

**Backend `.env.production`:**
```env
# Flask Settings
FLASK_ENV=production
DEBUG=False
TESTING=False
SECRET_KEY={GENERATE_RANDOM_SECRET_KEY}

# Database
DATABASE_URL=mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}
SQLALCHEMY_ECHO=False
SQLALCHEMY_POOL_SIZE=20
SQLALCHEMY_POOL_TIMEOUT=30

# JWT
JWT_SECRET_KEY={GENERATE_RANDOM_JWT_SECRET}

# CORS
CORS_ORIGINS=https://yourdomain.com

# Email
MAIL_SERVER={PRODUCTION_EMAIL_SERVER}
MAIL_PORT=587
MAIL_USERNAME={PRODUCTION_EMAIL}
MAIL_PASSWORD={PRODUCTION_EMAIL_PASSWORD}

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/v-assist/app.log

# Security
SECURE_COOKIES=True
SESSION_TIMEOUT=3600

# API Keys
OPENAI_API_KEY={YOUR_PRODUCTION_KEY}
```

**Frontend `.env.production`:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=V-Assist
VITE_VOICE_ENABLED=true
VITE_DEFAULT_LANGUAGE=en
VITE_LOG_LEVEL=warn
```

---

## 2. DATABASE CONFIGURATION

### 2.1 Performance Tuning (MySQL)

**Edit `my.cnf` or `my.ini`:**

```ini
[mysqld]
# Connection pooling
max_connections=500
max_user_connections=100

# Buffer sizes
innodb_buffer_pool_size=2G
tmp_table_size=128M
max_heap_table_size=128M

# Query optimization
query_cache_type=1
query_cache_size=256M
query_cache_limit=2M

# Logging
log_error=/var/log/mysql/error.log
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2

# Character set
character_set_server=utf8mb4
collation_server=utf8mb4_unicode_ci
```

### 2.2 Replication Setup (Production)

**Primary Server:**
```sql
-- Enable binary logging in my.cnf
-- server-id=1
-- log_bin=mysql-bin
-- binlog-format=ROW

-- Create replication user
CREATE USER 'repl'@'%' IDENTIFIED BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- Check binary log status
SHOW MASTER STATUS;
```

**Replica Server:**
```sql
-- Set server ID in my.cnf (different from primary)
-- server-id=2

-- Configure replication
CHANGE MASTER TO
  MASTER_HOST='primary_ip',
  MASTER_USER='repl',
  MASTER_PASSWORD='repl_password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=154;

-- Start replication
START SLAVE;

-- Verify replication
SHOW SLAVE STATUS\G
```

---

## 3. APPLICATION SERVER CONFIGURATION

### 3.1 Gunicorn Configuration

Create `backend/gunicorn.conf.py`:

```python
import multiprocessing

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 60
keepalive = 5

# Logging
accesslog = "/var/log/v-assist/access.log"
errorlog = "/var/log/v-assist/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "v-assist-api"

# Server mechanics
daemon = False
pidfile = "/var/run/v-assist.pid"
umask = 0
user = "www-data"
group = "www-data"
tmp_upload_dir = None

# SSL (if needed)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"
# ssl_version = "TLSv1_2"
```

Run with Gunicorn:
```bash
gunicorn -c gunicorn.conf.py app:app
```

### 3.2 Nginx Reverse Proxy

Create `/etc/nginx/sites-available/v-assist`:

```nginx
upstream v_assist_backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    keepalive 32;
}

upstream v_assist_frontend {
    server 127.0.0.1:3000;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/ssl/certs/cert.crt;
    ssl_certificate_key /etc/ssl/private/key.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://v_assist_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend
    location / {
        proxy_pass http://v_assist_frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/v-assist /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. SECURITY CONFIGURATION

### 4.1 JWT Security Best Practices

In `backend/app/utils/jwt_handler.py`:

```python
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta
import os

def create_tokens(user_id):
    """Create access and refresh tokens"""
    
    # Access token (short-lived)
    access_token = create_access_token(
        identity=user_id,
        expires_delta=timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 24)))
    )
    
    # Refresh token (long-lived)
    refresh_token = create_refresh_token(
        identity=user_id,
        expires_delta=timedelta(days=30)
    )
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_in': int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 24)) * 3600
    }
```

### 4.2 Password Security

In `backend/app/utils/password_utils.py`:

```python
from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password):
    """Hash password with pbkdf2:sha256"""
    return generate_password_hash(
        password,
        method='pbkdf2:sha256',
        salt_length=32
    )

def verify_password(password, password_hash):
    """Verify password against hash"""
    return check_password_hash(password_hash, password)
```

### 4.3 Input Validation

In `backend/app/utils/validators.py`:

```python
import re
from flask import request

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain digit"
    if not re.search(r'[!@#$%^&*]', password):
        return False, "Password must contain special character"
    return True, "Password is strong"

def validate_phone(phone):
    """Validate phone number"""
    pattern = r'^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$'
    return re.match(pattern, phone) is not None

def prevent_sql_injection(input_string):
    """Basic SQL injection prevention"""
    dangerous_keywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'UNION', 'SELECT']
    for keyword in dangerous_keywords:
        if keyword in input_string.upper():
            return False
    return True
```

---

## 5. MONITORING & LOGGING

### 5.1 Logging Configuration

In `backend/app/utils/logger.py`:

```python
import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logger(app):
    """Setup application logging"""
    
    log_level = os.getenv('LOG_LEVEL', 'INFO')
    log_file = os.getenv('LOG_FILE', 'logs/app.log')
    
    # Create logs directory
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    # File handler with rotation
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=int(os.getenv('LOG_MAX_BYTES', 10485760)),  # 10MB
        backupCount=int(os.getenv('LOG_BACKUP_COUNT', 10))
    )
    
    # Log format
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(formatter)
    
    # Set log level
    file_handler.setLevel(getattr(logging, log_level))
    app.logger.addHandler(file_handler)
    app.logger.setLevel(getattr(logging, log_level))
```

### 5.2 Application Metrics

In `backend/app/middleware/metrics.py`:

```python
from flask import request, g
import time
import logging

logger = logging.getLogger(__name__)

def track_request_metrics():
    """Track API request metrics"""
    
    g.start_time = time.time()
    g.url = request.url
    g.method = request.method

def log_request_metrics():
    """Log request completion metrics"""
    
    if hasattr(g, 'start_time'):
        duration = time.time() - g.start_time
        logger.info(
            f"Request completed: {g.method} {g.url} - "
            f"Duration: {duration:.3f}s"
        )

def register_metrics(app):
    """Register metrics tracking with app"""
    app.before_request(track_request_metrics)
    app.after_request(lambda response: log_request_metrics() or response)
```

---

## 6. CI/CD PIPELINE

### 6.1 GitHub Actions Workflow

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: v_assist_test_db
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
        ports:
          - 3306:3306
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.10'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        pytest tests/ -v --cov=app

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run tests
      run: |
        cd frontend
        npm test

  deploy:
    needs: [backend-tests, frontend-tests]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to production
      run: |
        # Deployment script here
        echo "Deploying to production..."
```

---

## 7. BACKUP & DISASTER RECOVERY

### 7.1 Automated Backup Script

Create `backend/scripts/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups/v-assist"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_NAME="v_assist_db"
DB_USER="root"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u $DB_USER -p"$DB_PASSWORD" $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Application files backup (optional)
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/v-assist

# Keep only last 30 days of backups
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR"
```

Schedule with cron:
```bash
# Backup every day at 2 AM
0 2 * * * /path/to/backup.sh
```

### 7.2 Restore Procedure

```bash
# Restore from backup
gunzip < /backups/v-assist/db_20260314_020000.sql.gz | mysql -u root -p v_assist_db

# Verify restoration
mysql -u root -p -e "SELECT COUNT(*) FROM v_assist_db.users;"
```

---

## 8. SCALING CONSIDERATIONS

### 8.1 Horizontal Scaling

**Load Balancer Configuration (HAProxy):**

```
global
    log stdout local0
    maxconn 4096
    
defaults
    log     global
    mode    http
    option  httplog
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend web_frontend
    bind *:80
    default_backend web_backend

backend web_backend
    balance roundrobin
    server app1 127.0.0.1:8000
    server app2 127.0.0.1:8001
    server app3 127.0.0.1:8002
    
    # Health check
    option httpchk GET /api/health
    http-check expect status 200
```

### 8.2 Caching Strategy

**Redis Configuration:**

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Key settings:
maxmemory 2gb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
```

**Backend Redis Integration:**

```python
from redis import Redis
from flask_caching import Cache

redis_client = Redis(host='localhost', port=6379, db=0)
cache = Cache(app, config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_URL': 'redis://localhost:6379/0'})

@app.route('/api/programs', methods=['GET'])
@cache.cached(timeout=3600)
def get_programs():
    # This will be cached for 1 hour
    pass
```

---

## 9. DEPLOYMENT CHECKLIST

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL/TLS certificates obtained
- [ ] Nginx reverse proxy configured
- [ ] Firewall rules configured
- [ ] Backup system implemented
- [ ] Monitoring alerts configured
- [ ] Log aggregation setup
- [ ] Security patches applied
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Emergency procedures documented

---

## 10. ROLLBACK PROCEDURES

### 10.1 Application Rollback

```bash
# Stop current deployment
sudo systemctl stop v-assist

# Restore from previous release
cd /var/www
tar -xzf v-assist-backup-20260314.tar.gz

# Start application
sudo systemctl start v-assist

# Verify
curl http://localhost:5000/api/health
```

### 10.2 Database Rollback

```bash
# Create backup of current state
mysqldump -u root -p v_assist_db > current_state.sql

# Restore from previous backup
mysql -u root -p v_assist_db < v_assist_db_20260314.sql

# Verify
mysql -u root -p -e "SELECT COUNT(*) FROM v_assist_db.users;"
```

---

**Configuration Complete!** Your V-Assist deployment is ready for production.

