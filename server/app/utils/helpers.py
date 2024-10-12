from app.models import Stage
from sqlalchemy import func
from app import db

def get_current_stage():
    """Fetches the most recent stage based on the current date."""
    return Stage.query.filter(Stage.date <= func.current_date()).order_by(Stage.date.desc()).first()

def calculate_team_points(team):
    """
    Calculates total sprint and mountain points for a given team.
    
    Updates the team's points in the database and returns the calculated values.
    """
    total_sprint_pts = sum(rider.sprint_pts for rider in team.riders)
    total_mountain_pts = sum(rider.mountain_pts for rider in team.riders)
    team.sprint_pts = total_sprint_pts
    team.mountain_pts = total_mountain_pts
    db.session.commit()
    return total_sprint_pts, total_mountain_pts
