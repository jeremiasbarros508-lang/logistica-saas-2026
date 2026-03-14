from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app import db
from app.models.shipment import Shipment

api_shipments_bp = Blueprint('api_shipments', __name__, url_prefix='/api/v1/shipments')


@api_shipments_bp.route('/', methods=['GET'])
@login_required
def list_shipments():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    status = request.args.get('status', '')

    query = Shipment.query
    if status:
        query = query.filter_by(status=status)

    paginated = query.order_by(Shipment.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False)

    return jsonify({
        'shipments': [s.to_dict() for s in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': page,
    })


@api_shipments_bp.route('/<int:shipment_id>', methods=['GET'])
@login_required
def get_shipment(shipment_id):
    shipment = Shipment.query.get_or_404(shipment_id)
    return jsonify(shipment.to_dict())


@api_shipments_bp.route('/', methods=['POST'])
@login_required
def create_shipment():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    origin = data.get('origin', '').strip()
    destination = data.get('destination', '').strip()
    if not origin or not destination:
        return jsonify({'error': 'Origin and destination are required'}), 400

    shipment = Shipment(
        tracking_number=Shipment.generate_tracking_number(),
        origin=origin,
        destination=destination,
        description=data.get('description', ''),
        weight_kg=data.get('weight_kg'),
        volume_m3=data.get('volume_m3'),
        vehicle_id=data.get('vehicle_id'),
        assigned_to=data.get('assigned_to', current_user.id),
        order_id=data.get('order_id'),
    )

    if data.get('estimated_delivery'):
        from datetime import datetime
        try:
            shipment.estimated_delivery = datetime.fromisoformat(data['estimated_delivery'])
        except ValueError:
            pass

    db.session.add(shipment)
    db.session.commit()
    return jsonify(shipment.to_dict()), 201


@api_shipments_bp.route('/<int:shipment_id>', methods=['PUT', 'PATCH'])
@login_required
def update_shipment(shipment_id):
    shipment = Shipment.query.get_or_404(shipment_id)
    if not current_user.is_manager() and shipment.assigned_to != current_user.id:
        return jsonify({'error': 'Forbidden'}), 403

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    for field in ('origin', 'destination', 'description', 'status',
                  'weight_kg', 'volume_m3', 'vehicle_id', 'assigned_to', 'order_id'):
        if field in data:
            setattr(shipment, field, data[field])

    if data.get('estimated_delivery'):
        from datetime import datetime
        try:
            shipment.estimated_delivery = datetime.fromisoformat(data['estimated_delivery'])
        except ValueError:
            pass

    if shipment.status == 'delivered' and not shipment.actual_delivery:
        from datetime import datetime, timezone
        shipment.actual_delivery = datetime.now(timezone.utc)

    db.session.commit()
    return jsonify(shipment.to_dict())


@api_shipments_bp.route('/<int:shipment_id>', methods=['DELETE'])
@login_required
def delete_shipment(shipment_id):
    if not current_user.is_admin():
        return jsonify({'error': 'Forbidden'}), 403
    shipment = Shipment.query.get_or_404(shipment_id)
    db.session.delete(shipment)
    db.session.commit()
    return jsonify({'message': 'Shipment deleted'}), 200


@api_shipments_bp.route('/track/<tracking_number>', methods=['GET'])
def track_shipment(tracking_number):
    shipment = Shipment.query.filter_by(tracking_number=tracking_number).first()
    if not shipment:
        return jsonify({'error': 'Shipment not found'}), 404
    return jsonify(shipment.to_dict())
