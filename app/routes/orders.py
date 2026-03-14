from flask import Blueprint, render_template, redirect, url_for, flash, request, abort
from flask_login import login_required, current_user

from app import db
from app.models.order import Order

orders_bp = Blueprint('orders', __name__, url_prefix='/orders')


@orders_bp.route('/')
@login_required
def index():
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')
    priority_filter = request.args.get('priority', '')
    search = request.args.get('search', '').strip()

    query = Order.query
    if status_filter:
        query = query.filter_by(status=status_filter)
    if priority_filter:
        query = query.filter_by(priority=priority_filter)
    if search:
        query = query.filter(
            db.or_(
                Order.order_number.ilike(f'%{search}%'),
                Order.customer_name.ilike(f'%{search}%'),
                Order.customer_email.ilike(f'%{search}%'),
            )
        )

    orders = query.order_by(Order.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False)

    return render_template('orders/index.html',
                           orders=orders,
                           status_filter=status_filter,
                           priority_filter=priority_filter,
                           search=search,
                           status_choices=Order.STATUS_CHOICES,
                           priority_choices=Order.PRIORITY_CHOICES)


@orders_bp.route('/new', methods=['GET', 'POST'])
@login_required
def new():
    if request.method == 'POST':
        customer_name = request.form.get('customer_name', '').strip()
        customer_email = request.form.get('customer_email', '').strip()
        customer_phone = request.form.get('customer_phone', '').strip()
        pickup_address = request.form.get('pickup_address', '').strip()
        delivery_address = request.form.get('delivery_address', '').strip()
        priority = request.form.get('priority', 'normal')
        notes = request.form.get('notes', '').strip()
        total_value = request.form.get('total_value', '')

        if not customer_name or not pickup_address or not delivery_address:
            flash('Customer name, pickup and delivery addresses are required.', 'danger')
            return render_template('orders/form.html', order=None,
                                   status_choices=Order.STATUS_CHOICES,
                                   priority_choices=Order.PRIORITY_CHOICES)

        order = Order(
            order_number=Order.generate_order_number(),
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            pickup_address=pickup_address,
            delivery_address=delivery_address,
            priority=priority,
            notes=notes,
            total_value=float(total_value) if total_value else 0.0,
            created_by=current_user.id,
        )
        db.session.add(order)
        db.session.commit()
        flash(f'Order {order.order_number} created successfully.', 'success')
        return redirect(url_for('orders.detail', order_id=order.id))

    return render_template('orders/form.html', order=None,
                           status_choices=Order.STATUS_CHOICES,
                           priority_choices=Order.PRIORITY_CHOICES)


@orders_bp.route('/<int:order_id>')
@login_required
def detail(order_id):
    order = Order.query.get_or_404(order_id)
    return render_template('orders/detail.html', order=order,
                           status_choices=Order.STATUS_CHOICES,
                           priority_choices=Order.PRIORITY_CHOICES)


@orders_bp.route('/<int:order_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(order_id):
    order = Order.query.get_or_404(order_id)
    if not current_user.is_manager() and order.created_by != current_user.id:
        abort(403)

    if request.method == 'POST':
        order.customer_name = request.form.get('customer_name', '').strip()
        order.customer_email = request.form.get('customer_email', '').strip()
        order.customer_phone = request.form.get('customer_phone', '').strip()
        order.pickup_address = request.form.get('pickup_address', '').strip()
        order.delivery_address = request.form.get('delivery_address', '').strip()
        order.priority = request.form.get('priority', 'normal')
        order.notes = request.form.get('notes', '').strip()
        total_value = request.form.get('total_value', '')
        order.total_value = float(total_value) if total_value else 0.0
        db.session.commit()
        flash('Order updated successfully.', 'success')
        return redirect(url_for('orders.detail', order_id=order.id))

    return render_template('orders/form.html', order=order,
                           status_choices=Order.STATUS_CHOICES,
                           priority_choices=Order.PRIORITY_CHOICES)


@orders_bp.route('/<int:order_id>/status', methods=['POST'])
@login_required
def update_status(order_id):
    order = Order.query.get_or_404(order_id)
    if not current_user.is_manager() and order.created_by != current_user.id:
        abort(403)

    new_status = request.form.get('status')
    if new_status in Order.STATUS_CHOICES:
        order.status = new_status
        db.session.commit()
        flash(f'Order status updated to {new_status}.', 'success')
    else:
        flash('Invalid status.', 'danger')

    return redirect(url_for('orders.detail', order_id=order_id))


@orders_bp.route('/<int:order_id>/delete', methods=['POST'])
@login_required
def delete(order_id):
    if not current_user.is_admin():
        abort(403)
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    flash('Order deleted.', 'success')
    return redirect(url_for('orders.index'))
