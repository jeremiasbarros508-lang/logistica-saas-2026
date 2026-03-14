from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_mail import Mail
from flask_wtf.csrf import CSRFProtect

from config import config

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()
mail = Mail()
csrf = CSRFProtect()

login_manager.login_view = 'auth.login'
login_manager.login_message = 'Please log in to access this page.'
login_manager.login_message_category = 'info'


def create_app(config_name=None):
    import os
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    csrf.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.shipments import shipments_bp
    from app.routes.orders import orders_bp
    from app.routes.fleet import fleet_bp
    from app.routes.api.shipments import api_shipments_bp
    from app.routes.api.users import api_users_bp
    from app.routes.api.analytics import api_analytics_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(shipments_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(fleet_bp)
    app.register_blueprint(api_shipments_bp)
    app.register_blueprint(api_users_bp)
    app.register_blueprint(api_analytics_bp)

    from app.routes.errors import register_error_handlers
    register_error_handlers(app)

    return app
