from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy import func
from datetime import datetime, timedelta, timezone

from app import db
from app.models.shipment import Shipment
from app.models.order import Order
from app.models.vehicle import Vehicle

api_analytics_bp = Blueprint('api_analytics', __name__, url_prefix='/api/v1/analytics')


@api_analytics_bp.route('/summary', methods=['GET'])
@login_required
def summary():
    total_shipments = Shipment.query.count()
    status_counts = dict(
        db.session.query(Shipment.status, func.count(Shipment.id))
        .group_by(Shipment.status).all()
    )
    total_orders = Order.query.count()
    order_status_counts = dict(
        db.session.query(Order.status, func.count(Order.id))
        .group_by(Order.status).all()
    )
    total_vehicles = Vehicle.query.count()
    vehicle_status_counts = dict(
        db.session.query(Vehicle.status, func.count(Vehicle.id))
        .group_by(Vehicle.status).all()
    )

    return jsonify({
        'shipments': {
            'total': total_shipments,
            'by_status': status_counts,
        },
        'orders': {
            'total': total_orders,
            'by_status': order_status_counts,
        },
        'vehicles': {
            'total': total_vehicles,
            'by_status': vehicle_status_counts,
        },
    })


@api_analytics_bp.route('/shipments/trend', methods=['GET'])
@login_required
def shipments_trend():
    days = request.args.get('days', 30, type=int)
    since = datetime.now(timezone.utc) - timedelta(days=days)

    results = (
        db.session.query(
            func.date(Shipment.created_at).label('date'),
            func.count(Shipment.id).label('count')
        )
        .filter(Shipment.created_at >= since)
        .group_by(func.date(Shipment.created_at))
        .order_by(func.date(Shipment.created_at))
        .all()
    )

    return jsonify({
        'trend': [{'date': str(r.date), 'count': r.count} for r in results]
    })


@api_analytics_bp.route('/orders/trend', methods=['GET'])
@login_required
def orders_trend():
    days = request.args.get('days', 30, type=int)
    since = datetime.now(timezone.utc) - timedelta(days=days)

    results = (
        db.session.query(
            func.date(Order.created_at).label('date'),
            func.count(Order.id).label('count')
        )
        .filter(Order.created_at >= since)
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )

    return jsonify({
        'trend': [{'date': str(r.date), 'count': r.count} for r in results]
    })
