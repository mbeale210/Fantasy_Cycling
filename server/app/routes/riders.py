# app/routes/riders.py
from flask import Blueprint, request, jsonify
from app.models import Rider, db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('riders', __name__, url_prefix='/riders')

@bp.route('', methods=['GET'])
def get_riders():
    riders = Rider.query.all()
    return jsonify([{
        "id": rider.id,
        "name": rider.name,
        "team": rider.team,
        "sprint_pts": rider.sprint_pts,
        "mountain_pts": rider.mountain_pts
    } for rider in riders]), 200

@bp.route('/<int:rider_id>', methods=['GET'])
def get_rider(rider_id):
    rider = Rider.query.get_or_404(rider_id)
    return jsonify({
        "id": rider.id,
        "name": rider.name,
        "team": rider.team,
        "sprint_pts": rider.sprint_pts,
        "mountain_pts": rider.mountain_pts
    }), 200
