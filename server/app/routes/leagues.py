from flask import Blueprint, jsonify
from app.models import League, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('leagues', __name__, url_prefix='/leagues')

@bp.route('', methods=['GET'])
@jwt_required()
def get_user_leagues():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify([{
        'id': league.id,
        'name': league.name
    } for league in user.leagues]), 200

@bp.route('/<int:league_id>/join', methods=['POST'])
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