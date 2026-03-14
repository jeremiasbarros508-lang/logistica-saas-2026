from flask import Blueprint, render_template, redirect, url_for, flash, request, abort
from flask_login import login_required, current_user

from app import db
from app.models.vehicle import Vehicle

fleet_bp = Blueprint('fleet', __name__, url_prefix='/fleet')


@fleet_bp.route('/')
@login_required
def index():
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')
    search = request.args.get('search', '').strip()

    query = Vehicle.query
    if status_filter:
        query = query.filter_by(status=status_filter)
    if search:
        query = query.filter(
            db.or_(
                Vehicle.plate.ilike(f'%{search}%'),
                Vehicle.model.ilike(f'%{search}%'),
                Vehicle.brand.ilike(f'%{search}%'),
                Vehicle.driver_name.ilike(f'%{search}%'),
            )
        )

    vehicles = query.order_by(Vehicle.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False)

    return render_template('fleet/index.html',
                           vehicles=vehicles,
                           status_filter=status_filter,
                           search=search,
                           status_choices=Vehicle.STATUS_CHOICES)


@fleet_bp.route('/new', methods=['GET', 'POST'])
@login_required
def new():
    if not current_user.is_manager():
        abort(403)

    if request.method == 'POST':
        plate = request.form.get('plate', '').strip().upper()
        model = request.form.get('model', '').strip()
        brand = request.form.get('brand', '').strip()
        year = request.form.get('year', '')
        capacity_kg = request.form.get('capacity_kg', '')
        capacity_m3 = request.form.get('capacity_m3', '')
        driver_name = request.form.get('driver_name', '').strip()
        driver_phone = request.form.get('driver_phone', '').strip()
        notes = request.form.get('notes', '').strip()

        if not plate:
            flash('License plate is required.', 'danger')
            return render_template('fleet/form.html', vehicle=None,
                                   status_choices=Vehicle.STATUS_CHOICES)

        if Vehicle.query.filter_by(plate=plate).first():
            flash('A vehicle with this plate already exists.', 'danger')
            return render_template('fleet/form.html', vehicle=None,
                                   status_choices=Vehicle.STATUS_CHOICES)

        vehicle = Vehicle(
            plate=plate,
            model=model,
            brand=brand,
            year=int(year) if year else None,
            capacity_kg=float(capacity_kg) if capacity_kg else None,
            capacity_m3=float(capacity_m3) if capacity_m3 else None,
            driver_name=driver_name,
            driver_phone=driver_phone,
            notes=notes,
        )
        db.session.add(vehicle)
        db.session.commit()
        flash(f'Vehicle {vehicle.plate} added to fleet.', 'success')
        return redirect(url_for('fleet.detail', vehicle_id=vehicle.id))

    return render_template('fleet/form.html', vehicle=None,
                           status_choices=Vehicle.STATUS_CHOICES)


@fleet_bp.route('/<int:vehicle_id>')
@login_required
def detail(vehicle_id):
    from app.models.shipment import Shipment
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    recent_shipments = (vehicle.shipments
                        .order_by(Shipment.created_at.desc())
                        .limit(10).all())
    return render_template('fleet/detail.html', vehicle=vehicle,
                           recent_shipments=recent_shipments,
                           status_choices=Vehicle.STATUS_CHOICES)


@fleet_bp.route('/<int:vehicle_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(vehicle_id):
    if not current_user.is_manager():
        abort(403)
    vehicle = Vehicle.query.get_or_404(vehicle_id)

    if request.method == 'POST':
        plate = request.form.get('plate', '').strip().upper()
        if not plate:
            flash('License plate is required.', 'danger')
            return render_template('fleet/form.html', vehicle=vehicle,
                                   status_choices=Vehicle.STATUS_CHOICES)

        existing = Vehicle.query.filter_by(plate=plate).first()
        if existing and existing.id != vehicle.id:
            flash('A vehicle with this plate already exists.', 'danger')
            return render_template('fleet/form.html', vehicle=vehicle,
                                   status_choices=Vehicle.STATUS_CHOICES)

        vehicle.plate = plate
        vehicle.model = request.form.get('model', '').strip()
        vehicle.brand = request.form.get('brand', '').strip()
        year = request.form.get('year', '')
        vehicle.year = int(year) if year else None
        capacity_kg = request.form.get('capacity_kg', '')
        vehicle.capacity_kg = float(capacity_kg) if capacity_kg else None
        capacity_m3 = request.form.get('capacity_m3', '')
        vehicle.capacity_m3 = float(capacity_m3) if capacity_m3 else None
        vehicle.driver_name = request.form.get('driver_name', '').strip()
        vehicle.driver_phone = request.form.get('driver_phone', '').strip()
        vehicle.notes = request.form.get('notes', '').strip()
        db.session.commit()
        flash('Vehicle updated successfully.', 'success')
        return redirect(url_for('fleet.detail', vehicle_id=vehicle.id))

    return render_template('fleet/form.html', vehicle=vehicle,
                           status_choices=Vehicle.STATUS_CHOICES)


@fleet_bp.route('/<int:vehicle_id>/status', methods=['POST'])
@login_required
def update_status(vehicle_id):
    if not current_user.is_manager():
        abort(403)
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    new_status = request.form.get('status')
    if new_status in Vehicle.STATUS_CHOICES:
        vehicle.status = new_status
        db.session.commit()
        flash(f'Vehicle status updated to {new_status}.', 'success')
    else:
        flash('Invalid status.', 'danger')
    return redirect(url_for('fleet.detail', vehicle_id=vehicle_id))


@fleet_bp.route('/<int:vehicle_id>/delete', methods=['POST'])
@login_required
def delete(vehicle_id):
    if not current_user.is_admin():
        abort(403)
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    db.session.delete(vehicle)
    db.session.commit()
    flash('Vehicle removed from fleet.', 'success')
    return redirect(url_for('fleet.index'))
