from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
teams_bp = Blueprint('teams', __name__, url_prefix='/teams')
riders_bp = Blueprint('riders', __name__, url_prefix='/riders')
stages_bp = Blueprint('stages', __name__, url_prefix='/stages')
leagues_bp = Blueprint('leagues', __name__, url_prefix='/leagues')

from . import auth, teams, riders, stages, leagues
