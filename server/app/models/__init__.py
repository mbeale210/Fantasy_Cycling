from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Remove individual imports to avoid circular dependencies
# from .user import User
# from .rider import Rider
# from .team import FantasyTeam
# from .stage import Stage, StageResult
# from .league import League