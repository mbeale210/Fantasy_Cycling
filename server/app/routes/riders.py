from flask import jsonify
from flask_jwt_extended import jwt_required
from app.models import Rider
from . import riders_bp

@riders_bp.route('', methods=['GET'])
@jwt_required()
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

@riders_bp.route('/<int:rider_id>', methods=['GET'])
@jwt_required()
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

# Added route for rider rankings
@riders_bp.route('/rankings', methods=['GET'])
def get_rider_rankings():
    # Query riders ordered by ranking
    riders = Rider.query.order_by(Rider.rank).all()
    return jsonify([{
        "id": rider.id,
        "name": rider.name,
        "rank": rider.rank,
        "career_points": rider.career_points,
        "sprint_pts": rider.sprint_pts,
        "mountain_pts": rider.mountain_pts,
        "is_gc": rider.is_gc
    } for rider in riders]), 200
