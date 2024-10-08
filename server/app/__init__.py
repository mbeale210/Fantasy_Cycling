# app/__init__.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fantasy_tdf.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    from .routes import auth, riders, teams, stages, comments
    app.register_blueprint(auth.bp)
    app.register_blueprint(riders.bp)
    app.register_blueprint(teams.bp)
    app.register_blueprint(stages.bp)
    app.register_blueprint(comments.bp)

    return app