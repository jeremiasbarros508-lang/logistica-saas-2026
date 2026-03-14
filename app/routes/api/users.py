from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from app import db
from app.models.user import User

api_users_bp = Blueprint('api_users', __name__, url_prefix='/api/v1/users')


@api_users_bp.route('/', methods=['GET'])
@login_required
def list_users():
    if not current_user.is_manager():
        return jsonify({'error': 'Forbidden'}), 403

    users = User.query.filter_by(is_active=True).all()
    return jsonify({'users': [u.to_dict() for u in users]})


@api_users_bp.route('/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    if not current_user.is_manager() and current_user.id != user_id:
        return jsonify({'error': 'Forbidden'}), 403
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


@api_users_bp.route('/<int:user_id>', methods=['PUT', 'PATCH'])
@login_required
def update_user(user_id):
    if not current_user.is_admin() and current_user.id != user_id:
        return jsonify({'error': 'Forbidden'}), 403

    user = User.query.get_or_404(user_id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data:
        user.name = data['name'].strip()
    if 'role' in data and current_user.is_admin():
        if data['role'] in User.ROLES:
            user.role = data['role']
        else:
            return jsonify({'error': 'Invalid role'}), 400
    if 'is_active' in data and current_user.is_admin():
        user.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify(user.to_dict())


@api_users_bp.route('/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if not current_user.is_admin():
        return jsonify({'error': 'Forbidden'}), 403
    if current_user.id == user_id:
        return jsonify({'error': 'Cannot delete yourself'}), 400
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    return jsonify({'message': 'User deactivated'})


@api_users_bp.route('/me', methods=['GET'])
@login_required
def me():
    return jsonify(current_user.to_dict())
