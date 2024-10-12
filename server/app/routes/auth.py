from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models.user import User
from app import db
from flask_cors import cross_origin  # Import cross_origin for handling CORS

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])  # Allow OPTIONS requests
@cross_origin()  # Apply CORS to this specific route
def register():
    if request.method == 'OPTIONS':  # Handle preflight request
        return jsonify({'message': 'CORS preflight successful'}), 200

    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'}), 201

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])  # Allow OPTIONS requests for login
@cross_origin()  # Apply CORS to the login route
def login():
    if request.method == 'OPTIONS':  # Handle preflight request
        return jsonify({'message': 'CORS preflight successful'}), 200

    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({'access_token': new_access_token}), 200

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200
