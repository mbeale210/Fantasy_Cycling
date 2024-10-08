# app/routes/stages.py
from flask import Blueprint, request, jsonify
from app.models import Stage, StageResult, Rider, db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('stages', __name__, url_prefix='/stages')

@bp.route('', methods=['GET'])
def get_stages():
    stages = Stage.query.all()
    return jsonify([{
        "id": stage.id,
        "number": stage.number,
        "date": stage.date.isoformat(),
        "type": stage.type
    } for stage in stages]), 200

@bp.route('/<int:stage_id>/results', methods=['GET'])
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

@bp.route('/<int:stage_id>/results', methods=['POST'])
@jwt_required()
def add_stage_result(stage_id):
    data = request.json
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
