from flask import Blueprint, render_template, redirect, url_for, flash, request, abort
from flask_login import login_required, current_user

from app import db
from app.models.shipment import Shipment
from app.models.vehicle import Vehicle
from app.models.user import User

shipments_bp = Blueprint('shipments', __name__, url_prefix='/shipments')


@shipments_bp.route('/')
@login_required
def index():
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')
    search = request.args.get('search', '').strip()

    query = Shipment.query
    if status_filter:
        query = query.filter_by(status=status_filter)
    if search:
        query = query.filter(
            db.or_(
                Shipment.tracking_number.ilike(f'%{search}%'),
                Shipment.origin.ilike(f'%{search}%'),
                Shipment.destination.ilike(f'%{search}%'),
            )
        )

    shipments = query.order_by(Shipment.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False)

    return render_template('shipments/index.html',
                           shipments=shipments,
                           status_filter=status_filter,
                           search=search,
                           status_choices=Shipment.STATUS_CHOICES)


@shipments_bp.route('/new', methods=['GET', 'POST'])
@login_required
def new():
    vehicles = Vehicle.query.filter_by(status='available').all()
    users = User.query.filter_by(is_active=True).all() if current_user.is_manager() else []

    if request.method == 'POST':
        origin = request.form.get('origin', '').strip()
        destination = request.form.get('destination', '').strip()
        description = request.form.get('description', '').strip()
        weight = request.form.get('weight_kg', '')
        volume = request.form.get('volume_m3', '')
        estimated_delivery = request.form.get('estimated_delivery', '')
        vehicle_id = request.form.get('vehicle_id', '')
        assigned_to = request.form.get('assigned_to', '')

        if not origin or not destination:
            flash('Origin and destination are required.', 'danger')
            return render_template('shipments/form.html',
                                   shipment=None, vehicles=vehicles, users=users)

        shipment = Shipment(
            tracking_number=Shipment.generate_tracking_number(),
            origin=origin,
            destination=destination,
            description=description,
            weight_kg=float(weight) if weight else None,
            volume_m3=float(volume) if volume else None,
            vehicle_id=int(vehicle_id) if vehicle_id else None,
            assigned_to=int(assigned_to) if assigned_to else current_user.id,
        )

        if estimated_delivery:
            from datetime import datetime
            try:
                shipment.estimated_delivery = datetime.strptime(estimated_delivery, '%Y-%m-%d')
            except ValueError:
                pass

        db.session.add(shipment)
        db.session.commit()
        flash(f'Shipment {shipment.tracking_number} created successfully.', 'success')
        return redirect(url_for('shipments.detail', shipment_id=shipment.id))

    return render_template('shipments/form.html',
                           shipment=None, vehicles=vehicles, users=users)


@shipments_bp.route('/<int:shipment_id>')
@login_required
def detail(shipment_id):
    shipment = Shipment.query.get_or_404(shipment_id)
    return render_template('shipments/detail.html', shipment=shipment,
                           status_choices=Shipment.STATUS_CHOICES)


@shipments_bp.route('/<int:shipment_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(shipment_id):
    shipment = Shipment.query.get_or_404(shipment_id)
    if not current_user.is_manager() and shipment.assigned_to != current_user.id:
        abort(403)

    vehicles = Vehicle.query.all()
    users = User.query.filter_by(is_active=True).all()

    if request.method == 'POST':
        shipment.origin = request.form.get('origin', shipment.origin).strip()
        shipment.destination = request.form.get('destination', shipment.destination).strip()
        shipment.description = request.form.get('description', '').strip()
        weight = request.form.get('weight_kg', '')
        volume = request.form.get('volume_m3', '')
        shipment.weight_kg = float(weight) if weight else None
        shipment.volume_m3 = float(volume) if volume else None
        vehicle_id = request.form.get('vehicle_id', '')
        shipment.vehicle_id = int(vehicle_id) if vehicle_id else None
        assigned_to = request.form.get('assigned_to', '')
        if current_user.is_manager() and assigned_to:
            shipment.assigned_to = int(assigned_to)

        estimated_delivery = request.form.get('estimated_delivery', '')
        if estimated_delivery:
            from datetime import datetime
            try:
                shipment.estimated_delivery = datetime.strptime(estimated_delivery, '%Y-%m-%d')
            except ValueError:
                pass

        db.session.commit()
        flash('Shipment updated successfully.', 'success')
        return redirect(url_for('shipments.detail', shipment_id=shipment.id))

    return render_template('shipments/form.html',
                           shipment=shipment, vehicles=vehicles, users=users)


@shipments_bp.route('/<int:shipment_id>/status', methods=['POST'])
@login_required
def update_status(shipment_id):
    shipment = Shipment.query.get_or_404(shipment_id)
    if not current_user.is_manager() and shipment.assigned_to != current_user.id:
        abort(403)

    new_status = request.form.get('status')
    if new_status in Shipment.STATUS_CHOICES:
        shipment.status = new_status
        if new_status == 'delivered':
            from datetime import datetime, timezone
            shipment.actual_delivery = datetime.now(timezone.utc)
        db.session.commit()
        flash(f'Status updated to {new_status}.', 'success')
    else:
        flash('Invalid status.', 'danger')

    return redirect(url_for('shipments.detail', shipment_id=shipment_id))


@shipments_bp.route('/<int:shipment_id>/delete', methods=['POST'])
@login_required
def delete(shipment_id):
    if not current_user.is_admin():
        abort(403)
    shipment = Shipment.query.get_or_404(shipment_id)
    db.session.delete(shipment)
    db.session.commit()
    flash('Shipment deleted.', 'success')
    return redirect(url_for('shipments.index'))


@shipments_bp.route('/track')
def track():
    tracking_number = request.args.get('tracking', '').strip()
    shipment = None
    if tracking_number:
        shipment = Shipment.query.filter_by(tracking_number=tracking_number).first()
    return render_template('shipments/track.html',
                           shipment=shipment, tracking_number=tracking_number)
