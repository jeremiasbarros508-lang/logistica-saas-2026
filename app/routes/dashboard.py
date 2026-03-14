from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from sqlalchemy import func

from app import db
from app.models.shipment import Shipment
from app.models.order import Order
from app.models.vehicle import Vehicle
from app.models.user import User

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/')
@login_required
def index():
    total_shipments = Shipment.query.count()
    pending_shipments = Shipment.query.filter_by(status='pending').count()
    in_transit = Shipment.query.filter_by(status='in_transit').count()
    delivered_today = Shipment.query.filter_by(status='delivered').count()

    total_orders = Order.query.count()
    new_orders = Order.query.filter_by(status='new').count()

    available_vehicles = Vehicle.query.filter_by(status='available').count()
    total_vehicles = Vehicle.query.count()

    recent_shipments = (Shipment.query
                        .order_by(Shipment.created_at.desc())
                        .limit(10).all())

    recent_orders = (Order.query
                     .order_by(Order.created_at.desc())
                     .limit(5).all())

    status_counts = (db.session.query(Shipment.status, func.count(Shipment.id))
                     .group_by(Shipment.status).all())
    status_data = {s: c for s, c in status_counts}

    stats = {
        'total_shipments': total_shipments,
        'pending_shipments': pending_shipments,
        'in_transit': in_transit,
        'delivered_today': delivered_today,
        'total_orders': total_orders,
        'new_orders': new_orders,
        'available_vehicles': available_vehicles,
        'total_vehicles': total_vehicles,
        'status_data': status_data,
    }

    return render_template('dashboard/index.html',
                           stats=stats,
                           recent_shipments=recent_shipments,
                           recent_orders=recent_orders)
