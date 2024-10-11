from app import create_app, db
from app.models import User, Rider, FantasyTeam, Stage, StageResult, League

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