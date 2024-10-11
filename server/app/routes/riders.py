from flask import Blueprint, jsonify
from app.models import Rider
from flask_login import login_required

bp = Blueprint('riders', __name__, url_prefix='/riders')

@bp.route('', methods=['GET'])
@login_required
def get_riders():
    riders = Rider.query.all()
    return jsonify([{
        "id": rider.id,
        "name": rider.name,
        "rank": rider.rank,
        "career_points": rider.career_points,
        "sprint_pts": rider.sprint_pts,
        "mountain_pts": rider.mountain_pts,
        "is_gc": rider.is_gc
    } for rider in riders]), 200

@bp.route('/<int:rider_id>', methods=['GET'])
@login_required
def get_rider(rider_id):
    rider = Rider.query.get_or_404(rider_id)
    return jsonify({
        "id": rider.id,
        "name": rider.name,
        "rank": rider.rank,
        "career_points": rider.career_points,
        "sprint_pts": rider.sprint_pts,
        "mountain_pts": rider.mountain_pts,
        "is_gc": rider.is_gc
    }), 200