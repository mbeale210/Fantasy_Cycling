from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .models import db
from .routes import auth, teams, riders, stages, leagues

def create_app(config_class):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app)

    app.register_blueprint(auth.bp)
    app.register_blueprint(teams.bp)
    app.register_blueprint(riders.bp)
    app.register_blueprint(stages.bp)
    app.register_blueprint(leagues.bp)

    return app