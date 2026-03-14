from app.routes.auth import auth_bp
from app.routes.dashboard import dashboard_bp
from app.routes.shipments import shipments_bp
from app.routes.orders import orders_bp
from app.routes.fleet import fleet_bp

__all__ = ['auth_bp', 'dashboard_bp', 'shipments_bp', 'orders_bp', 'fleet_bp']
