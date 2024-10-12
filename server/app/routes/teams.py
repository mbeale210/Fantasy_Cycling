from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import FantasyTeam, Rider, Stage
from app import db
from . import teams_bp

@teams_bp.route('', methods=['POST'])
@jwt_required()
def create_team():
    data = request.get_json()
    user_id = get_jwt_identity()
    new_team = FantasyTeam(name=data['name'], user_id=user_id, league_id=data.get('league_id'))
    db.session.add(new_team)
    db.session.commit()
    return jsonify({"message": "Team created successfully", "id": new_team.id}), 201

@teams_bp.route('', methods=['GET'])
@jwt_required()
def get_user_teams():
    user_id = get_jwt_identity()
    teams = FantasyTeam.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": team.id,
        "name": team.name,
        "sprint_pts": team.sprint_pts,
        "mountain_pts": team.mountain_pts,
        "trades_left": team.trades_left
    } for team in teams]), 200

@teams_bp.route('/<int:team_id>', methods=['GET'])
@jwt_required()
def get_team(team_id):
    user_id = get_jwt_identity()
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 403
    return jsonify({
        "id": team.id,
        "name": team.name,
        "sprint_pts": team.sprint_pts,
        "mountain_pts": team.mountain_pts,
        "trades_left": team.trades_left,
        "riders": [{
            "id": rider.id,
            "name": rider.name,
            "is_gc": rider.is_gc
        } for rider in team.riders]
    }), 200

@teams_bp.route('/<int:team_id>/roster', methods=['PUT'])
@jwt_required()
def update_roster(team_id):
    user_id = get_jwt_identity()
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    current_stage = Stage.query.filter(Stage.date <= db.func.current_date()).order_by(Stage.date.desc()).first()

    if not current_stage.is_rest_day and current_stage.number > 1:
        if team.trades_left == 0:
            return jsonify({"message": "No trades left"}), 400
        team.trades_left -= 1

    new_riders = Rider.query.filter(Rider.id.in_(data['rider_ids'])).all()
    team.riders = new_riders
    db.session.commit()
    return jsonify({"message": "Roster updated successfully"}), 200