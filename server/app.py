from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    from app.routes import auth, teams, riders, stages, leagues
    app.register_blueprint(auth.bp)
    app.register_blueprint(teams.bp)
    app.register_blueprint(riders.bp)
    app.register_blueprint(stages.bp)
    app.register_blueprint(leagues.bp)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)