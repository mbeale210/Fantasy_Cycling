from . import db

class Rider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    team = db.Column(db.String(100), nullable=False)
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)
    fantasy_team_id = db.Column(db.Integer, db.ForeignKey('fantasy_team.id'))