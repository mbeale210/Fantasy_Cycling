from app import create_app, db
from app.models import User, Rider, Stage, StageResult  # Import all your models

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Rider': Rider, 'Stage': Stage, 'StageResult': StageResult}