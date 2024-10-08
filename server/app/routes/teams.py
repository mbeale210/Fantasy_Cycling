# app/routes/teams.py
from flask import Blueprint, request, jsonify
from app.models import FantasyTeam, Rider, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('teams', __name__, url_prefix='/teams')

@bp.route('', methods=['POST'])
@jwt_required()
def create_team():
    data = request.json
    user_id = get_jwt_identity()
    new_team = FantasyTeam(name=data['name'], user_id=user_id, league_id=data.get('league_id'))
    db.session.add(new_team)
    db.session.commit()
    return jsonify({"message": "Team created successfully", "id": new_team.id}), 201

@bp.route('', methods=['GET'])
@jwt_required()
def get_user_teams():
    user_id = get_jwt_identity()
    teams = FantasyTeam.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": team.id,
        "name": team.name,
        "sprint_pts": team.sprint_pts,
        "mountain_pts": team.mountain_pts
    } for team in teams]), 200

@bp.route('/<int:team_id>', methods=['GET'])
@jwt_required()
def get_team(team_id):
    team = FantasyTeam.query.get_or_404(team_id)
    return jsonify({
        "id": team.id,
        "name": team.name,
        "sprint_pts": team.sprint_pts,
        "mountain_pts": team.mountain_pts,
        "riders": [{
            "id": rider.id,
            "name": rider.name,
            "team": rider.team
        } for rider in team.riders]
    }), 200

@bp.route('/<int:team_id>', methods=['PUT'])
@jwt_required()
def update_team(team_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    data = request.json
    team.name = data.get('name', team.name)
    db.session.commit()
    return jsonify({"message": "Team updated successfully"}), 200

@bp.route('/<int:team_id>', methods=['DELETE'])
@jwt_required()
def delete_team(team_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    db.session.delete(team)
    db.session.commit()
    return jsonify({"message": "Team deleted successfully"}), 200

@bp.route('/<int:team_id>/riders', methods=['POST'])
@jwt_required()
def add_rider_to_team(team_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    data = request.json
    rider = Rider.query.get_or_404(data['rider_id'])
    team.riders.append(rider)
    db.session.commit()
    return jsonify({"message": "Rider added to team successfully"}), 200

@bp.route('/<int:team_id>/riders/<int:rider_id>', methods=['DELETE'])
@jwt_required()
def remove_rider_from_team(team_id, rider_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    rider = Rider.query.get_or_404(rider_id)
    team.riders.remove(rider)
    db.session.commit()
    return jsonify({"message": "Rider removed from team successfully"}), 200
