from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    from .models import User, Rider, FantasyTeam, Stage, StageResult, League
    from .routes import auth, teams, riders, stages, leagues
    app.register_blueprint(auth.bp)
    app.register_blueprint(teams.bp)
    app.register_blueprint(riders.bp)
    app.register_blueprint(stages.bp)
    app.register_blueprint(leagues.bp)

    return app