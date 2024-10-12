from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import League, User, db
from . import leagues_bp

@leagues_bp.route('', methods=['GET'])
@jwt_required()
def get_user_leagues():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify([{
        'id': league.id,
        'name': league.name
    } for league in user.leagues]), 200

@leagues_bp.route('', methods=['POST'])
@jwt_required()
def create_league():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_league = League(name=data['name'])
    user = User.query.get(user_id)
    new_league.users.append(user)
    db.session.add(new_league)
    db.session.commit()
    return jsonify({
        'id': new_league.id,
        'name': new_league.name
    }), 201

@leagues_bp.route('/<int:league_id>/join', methods=['POST'])
@jwt_required()
def join_league(league_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    league = League.query.get_or_404(league_id)
    if league not in user.leagues:
        user.leagues.append(league)
        db.session.commit()
        return jsonify({
            'id': league.id,
            'name': league.name
        }), 200
    return jsonify({'message': 'Already a member of this league'}), 400