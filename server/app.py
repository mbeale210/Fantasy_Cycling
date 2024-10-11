from app import create_app, db
from app.models.user import User
from app.models.rider import Rider
from app.models.team import FantasyTeam
from app.models.stage import Stage, StageResult
from app.models.league import League

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Rider': Rider,
        'FantasyTeam': FantasyTeam,
        'Stage': Stage,
        'StageResult': StageResult,
        'League': League
    }

if __name__ == '__main__':
    app.run(debug=True)