from datetime import datetime, timezone
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash

from app import db, mail
from app.models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        remember = request.form.get('remember') == 'on'

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password) and user.is_active:
            user.last_login = datetime.now(timezone.utc)
            db.session.commit()
            login_user(user, remember=remember)
            next_page = request.args.get('next')
            flash('Welcome back, {}!'.format(user.name), 'success')
            return redirect(next_page or url_for('dashboard.index'))
        flash('Invalid email or password.', 'danger')

    return render_template('auth/login.html')


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not name or not email or not password:
            flash('All fields are required.', 'danger')
        elif password != confirm_password:
            flash('Passwords do not match.', 'danger')
        elif len(password) < 8:
            flash('Password must be at least 8 characters.', 'danger')
        elif User.query.filter_by(email=email).first():
            flash('Email already registered.', 'danger')
        else:
            user = User(name=name, email=email, role='user')
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            flash('Account created! Please log in.', 'success')
            return redirect(url_for('auth.login'))

    return render_template('auth/register.html')


@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('auth.login'))


@auth_bp.route('/reset-password', methods=['GET', 'POST'])
def reset_request():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        user = User.query.filter_by(email=email).first()
        if user:
            token = user.get_reset_token()
            try:
                from flask_mail import Message
                msg = Message('Password Reset - Tech Logistics',
                              recipients=[user.email])
                reset_url = url_for('auth.reset_token', token=token, _external=True)
                msg.body = f'''To reset your password, visit the following link:
{reset_url}

If you did not make this request, ignore this email.
This link expires in 30 minutes.
'''
                mail.send(msg)
            except Exception:
                pass
        flash('If that email exists, a reset link has been sent.', 'info')
        return redirect(url_for('auth.login'))

    return render_template('auth/reset_request.html')


@auth_bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_token(token):
    if current_user.is_authenticated:
        return redirect(url_for('dashboard.index'))

    user = User.verify_reset_token(token)
    if not user:
        flash('That reset link is invalid or expired.', 'warning')
        return redirect(url_for('auth.reset_request'))

    if request.method == 'POST':
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        if len(password) < 8:
            flash('Password must be at least 8 characters.', 'danger')
        elif password != confirm_password:
            flash('Passwords do not match.', 'danger')
        else:
            user.set_password(password)
            db.session.commit()
            flash('Password updated! Please log in.', 'success')
            return redirect(url_for('auth.login'))

    return render_template('auth/reset_token.html')


@auth_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        current_password = request.form.get('current_password', '')
        new_password = request.form.get('new_password', '')
        confirm_password = request.form.get('confirm_password', '')

        if name:
            current_user.name = name

        if current_password:
            if not current_user.check_password(current_password):
                flash('Current password is incorrect.', 'danger')
                return render_template('auth/profile.html')
            if len(new_password) < 8:
                flash('New password must be at least 8 characters.', 'danger')
                return render_template('auth/profile.html')
            if new_password != confirm_password:
                flash('New passwords do not match.', 'danger')
                return render_template('auth/profile.html')
            current_user.set_password(new_password)

        db.session.commit()
        flash('Profile updated successfully.', 'success')
        return redirect(url_for('auth.profile'))

    return render_template('auth/profile.html')
