from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.models import Stage, StageResult
from app import db
from . import stages_bp

@stages_bp.route('', methods=['GET'])
# Removed @jwt_required() to make this public
def get_stages():
    stages = Stage.query.all()
    return jsonify([{
        "id": stage.id,
        "number": stage.number,
        "date": stage.date.isoformat(),
        "type": stage.type,
        "is_rest_day": stage.is_rest_day
    } for stage in stages]), 200

@stages_bp.route('/<int:stage_id>/results', methods=['GET'])
@jwt_required()
def get_stage_results(stage_id):
    results = StageResult.query.filter_by(stage_id=stage_id).all()
    return jsonify([{
        "id": result.id,
        "rider_id": result.rider_id,
        "rider_name": result.rider.name,
        "time": result.time,
        "sprint_pts": result.sprint_pts,
        "mountain_pts": result.mountain_pts
    } for result in results]), 200

@stages_bp.route('/<int:stage_id>/results', methods=['POST'])
@jwt_required()
def add_stage_result(stage_id):
    data = request.get_json()
    new_result = StageResult(
        rider_id=data['rider_id'],
        stage_id=stage_id,
        time=data['time'],
        sprint_pts=data.get('sprint_pts', 0),
        mountain_pts=data.get('mountain_pts', 0)
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({"message": "Stage result added successfully", "id": new_result.id}), 201
