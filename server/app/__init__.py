from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from server.config import Config  # Update this line

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    CORS(app)

    # Update these import statements
    from server.app.models import user, rider, team, stage, league
    from server.app.routes import auth, teams, riders, stages, leagues

    app.register_blueprint(auth.bp)
    app.register_blueprint(teams.bp)
    app.register_blueprint(riders.bp)
    app.register_blueprint(stages.bp)
    app.register_blueprint(leagues.bp)

    @login_manager.user_loader
    def load_user(user_id):
        return user.User.query.get(int(user_id))

    return app