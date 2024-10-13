from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from config import Config
from werkzeug.security import generate_password_hash, check_password_hash
from flask_bcrypt import Bcrypt

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Import routes and models after extensions are initialized
    from app.models import User, League, FantasyTeam, Rider, Stage, StageResult

    # Auth Routes
    @app.route('/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"message": "Username already exists"}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already exists"}), 400

        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Registered successfully'}), 201

    @app.route('/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }), 200
        return jsonify({'message': 'Invalid username or password'}), 401

    @app.route('/auth/refresh', methods=['POST'])
    @jwt_required(refresh=True)
    def refresh():
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return jsonify({'access_token': new_access_token}), 200

    @app.route('/auth/user', methods=['GET'])
    @jwt_required()
    def get_user():
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 200

    # Rider Rankings Route - Public access (no login required)
    @app.route('/riders/rankings', methods=['GET', 'OPTIONS'])
    def get_rider_rankings():
        if request.method == 'OPTIONS':
            return jsonify({'message': 'CORS preflight successful'}), 200

        riders = Rider.query.order_by(Rider.rank).all()
        return jsonify([{
            "id": rider.id,
            "name": rider.name,
            "rank": rider.rank,
            "career_points": rider.career_points,
            "sprint_pts": rider.sprint_pts,
            "mountain_pts": rider.mountain_pts,
            "is_gc": rider.is_gc,
            "team": rider.fantasy_teams[0].name if rider.fantasy_teams else "Open Rider"  # Get team name or "Open Rider"
        } for rider in riders]), 200

    # Open Riders Route - Fetch only unassigned riders
    @app.route('/riders/open', methods=['GET'])
    def get_open_riders():
        open_riders = Rider.query.filter(~Rider.fantasy_teams.any()).all()
        return jsonify([{
            "id": rider.id,
            "name": rider.name,
            "rank": rider.rank,
            "career_points": rider.career_points,
            "sprint_pts": rider.sprint_pts,
            "mountain_pts": rider.mountain_pts,
            "is_gc": rider.is_gc
        } for rider in open_riders]), 200

    # Teams Route
    @app.route('/teams', methods=['GET', 'POST', 'OPTIONS'])
    @jwt_required()
    def handle_teams():
        if request.method == 'OPTIONS':
            return jsonify({'message': 'CORS preflight successful'}), 200

        user_id = get_jwt_identity()
        if request.method == 'POST':
            data = request.get_json()

            # Automatically assign the first available league for now
            default_league = League.query.first()  # Assuming you only have one league for now

            if not default_league:
                return jsonify({"message": "No leagues found"}), 400  # Return error if no league exists

            # Use the default_league.id if the league_id is not provided
            new_team = FantasyTeam(name=data['name'], user_id=user_id, league_id=default_league.id)
            db.session.add(new_team)
            db.session.commit()
            return jsonify({"message": "Team created successfully", "id": new_team.id}), 201

        elif request.method == 'GET':
            teams = FantasyTeam.query.filter_by(user_id=user_id).all()
            return jsonify([{
                "id": team.id,
                "name": team.name,
                "sprint_pts": team.sprint_pts,
                "mountain_pts": team.mountain_pts,
                "riders": [{
                    "id": rider.id,
                    "name": rider.name,
                    "is_gc": rider.is_gc,  # Ensure is_gc is included
                } for rider in team.riders]
            } for team in teams]), 200

    # PUT route to update the team's roster
    @app.route('/teams/<int:team_id>/roster', methods=['PUT', 'OPTIONS'])
    @jwt_required()
    def update_team_roster(team_id):
        if request.method == 'OPTIONS':
            return jsonify({'message': 'CORS preflight successful'}), 200

        data = request.get_json()
        team = FantasyTeam.query.get_or_404(team_id)

        # Update riders with actual Rider objects, not dicts
        riders_ids = [r['id'] for r in data.get('riders', [])]
        riders = Rider.query.filter(Rider.id.in_(riders_ids)).all()

        team.riders = riders

        db.session.commit()
        return jsonify({
            "id": team.id,
            "name": team.name,
            "sprint_pts": team.sprint_pts,
            "mountain_pts": team.mountain_pts,
            "riders": [{
                "id": rider.id,
                "name": rider.name,
                "is_gc": rider.is_gc
            } for rider in team.riders]
        }), 200

    # Route to update the team's name
    @app.route('/teams/<int:team_id>/name', methods=['PUT'])
    @jwt_required()
    def update_team_name(team_id):
        data = request.get_json()
        team = FantasyTeam.query.get_or_404(team_id)
        team.name = data['name']
        db.session.commit()
        return jsonify({"id": team.id, "name": team.name}), 200

    # Route to remove a rider from the team
    @app.route('/teams/<int:team_id>/riders/<int:rider_id>', methods=['DELETE'])
    @jwt_required()
    def remove_rider_from_team(team_id, rider_id):
        team = FantasyTeam.query.get_or_404(team_id)
        rider = Rider.query.get_or_404(rider_id)

        if rider in team.riders:
            team.riders.remove(rider)
            db.session.commit()
            return jsonify({"message": "Rider removed successfully", "id": team.id, "riderId": rider.id}), 200
        return jsonify({"message": "Rider not found on team"}), 404

    # Route to delete a team
    @app.route('/teams/<int:team_id>', methods=['DELETE', 'OPTIONS'])
    @jwt_required()
    def delete_team(team_id):
        if request.method == 'OPTIONS':
            # CORS preflight handling
            return jsonify({'message': 'CORS preflight successful'}), 200

        team = FantasyTeam.query.get_or_404(team_id)

        # Check if the user deleting the team is the owner of the team
        current_user_id = get_jwt_identity()
        if team.user_id != current_user_id:
            return jsonify({'message': 'You are not authorized to delete this team'}), 403

        db.session.delete(team)
        db.session.commit()
        return jsonify({"message": "Team deleted successfully", "id": team.id}), 200

    # Route to swap a GC rider with a domestique
    @app.route('/teams/<int:team_id>/riders/<int:rider_id>/swap', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def swap_rider_role(team_id, rider_id):
        if request.method == 'OPTIONS':
            return jsonify({'message': 'CORS preflight successful'}), 200

        team = FantasyTeam.query.get_or_404(team_id)
        rider = Rider.query.get_or_404(rider_id)

        # Check if rider is in the team
        if rider not in team.riders:
            return jsonify({"message": "Rider not found on the team"}), 404

        # Swap role (GC to domestique and vice versa)
        rider.is_gc = not rider.is_gc
        db.session.commit()

        return jsonify({
            "message": "Rider role swapped successfully",
            "id": rider.id,
            "name": rider.name,
            "is_gc": rider.is_gc,
            "riders": [{
                "id": r.id,
                "name": r.name,
                "is_gc": r.is_gc
            } for r in team.riders]
        }), 200

    # Stages Route
    @app.route('/stages', methods=['GET', 'OPTIONS'])
    def get_stages():
        if request.method == 'OPTIONS':
            return jsonify({'message': 'CORS preflight successful'}), 200

        stages = Stage.query.all()
        return jsonify([{
            "id": stage.id,
            "number": stage.number,
            "date": stage.date.isoformat(),
            "type": stage.type,
            "is_rest_day": stage.is_rest_day
        } for stage in stages]), 200

    # Route for fetching stage results
    @app.route('/stages/<int:stage_id>/results', methods=['GET'])
    def get_stage_results(stage_id):
        results = StageResult.query.filter_by(stage_id=stage_id).all()
        return jsonify([{
            "id": result.id,
            "rider_name": result.rider.name,
            "team": result.rider.fantasy_teams[0].name if result.rider.fantasy_teams else "Unassigned",
            "time": result.time,
            "sprint_pts": result.sprint_pts,
            "mountain_pts": result.mountain_pts
        } for result in results]), 200

    return app
