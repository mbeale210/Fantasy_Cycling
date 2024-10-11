from flask import Blueprint, request, jsonify
from app.models import FantasyTeam, Rider, Stage
from app import db
from flask_login import login_required, current_user

bp = Blueprint('teams', __name__, url_prefix='/teams')

@bp.route('', methods=['POST'])
@login_required
def create_team():
    data = request.json
    new_team = FantasyTeam(name=data['name'], user_id=current_user.id, league_id=data.get('league_id'))
    db.session.add(new_team)
    db.session.commit()
    return jsonify({"message": "Team created successfully", "id": new_team.id}), 201

@bp.route('', methods=['GET'])
@login_required
def get_user_teams():
    teams = FantasyTeam.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        "id": team.id,
        "name": team.name,
        "sprint_pts": team.sprint_pts,
        "mountain_pts": team.mountain_pts,
        "trades_left": team.trades_left
    } for team in teams]), 200

@bp.route('/<int:team_id>', methods=['GET'])
@login_required
def get_team(team_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    return jsonify({
        "id": team.id,
        "name": team.name,
        "sprint_pts": team.sprint_pts,
        "mountain_pts": team.mountain_pts,
        "trades_left": team.trades_left,
        "active_gc_rider": {
            "id": team.active_gc_rider.id,
            "name": team.active_gc_rider.name,
            "team": team.active_gc_rider.team
        } if team.active_gc_rider else None,
        "active_domestiques": [{
            "id": rider.id,
            "name": rider.name,
            "team": rider.team
        } for rider in team.active_domestiques],
        "bench_gc_riders": [{
            "id": rider.id,
            "name": rider.name,
            "team": rider.team
        } for rider in team.bench_gc_riders],
        "bench_domestiques": [{
            "id": rider.id,
            "name": rider.name,
            "team": rider.team
        } for rider in team.bench_domestiques]
    }), 200

@bp.route('/<int:team_id>/roster', methods=['PUT'])
@login_required
def update_roster(team_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.json
    current_stage = Stage.query.filter(Stage.date <= db.func.current_date()).order_by(Stage.date.desc()).first()

    if not current_stage.is_rest_day and current_stage.number > 1:
        # Check if it's a trade
        if set(data['active_gc_rider'] + data['active_domestiques'] + data['bench_gc_riders'] + data['bench_domestiques']) != set(rider.id for rider in team.riders):
            if team.trades_left == 0:
                return jsonify({"message": "No trades left"}), 400
            team.trades_left -= 1
        else:
            # Only allow switching active and bench riders
            allowed_changes = (
                set(data['active_gc_rider']) == {team.active_gc_rider.id} and
                set(data['active_domestiques']) == set(r.id for r in team.active_domestiques) and
                set(data['bench_gc_riders']) == set(r.id for r in team.bench_gc_riders) and
                set(data['bench_domestiques']) == set(r.id for r in team.bench_domestiques)
            )
            if not allowed_changes:
                return jsonify({"message": "Can only switch active and bench riders outside of rest days"}), 400

    # Update roster
    team.active_gc_rider_id = data['active_gc_rider'][0]
    team.active_domestiques = Rider.query.filter(Rider.id.in_(data['active_domestiques'])).all()
    team.bench_gc_riders = Rider.query.filter(Rider.id.in_(data['bench_gc_riders'])).all()
    team.bench_domestiques = Rider.query.filter(Rider.id.in_(data['bench_domestiques'])).all()

    db.session.commit()
    return jsonify({"message": "Roster updated successfully"}), 200

@bp.route('/<int:team_id>/riders', methods=['POST'])
@login_required
def add_rider_to_team(team_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    data = request.json
    rider = Rider.query.get_or_404(data['rider_id'])
    if rider not in team.riders and len(team.riders) < 9:
        team.riders.append(rider)
        db.session.commit()
        return jsonify({"message": "Rider added to team successfully"}), 200
    return jsonify({"message": "Unable to add rider to team"}), 400

@bp.route('/<int:team_id>/riders/<int:rider_id>', methods=['DELETE'])
@login_required
def remove_rider_from_team(team_id, rider_id):
    team = FantasyTeam.query.get_or_404(team_id)
    if team.user_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    rider = Rider.query.get_or_404(rider_id)
    if rider in team.riders:
        team.riders.remove(rider)
        db.session.commit()
        return jsonify({"message": "Rider removed from team successfully"}), 200
    return jsonify({"message": "Rider not in team"}), 400