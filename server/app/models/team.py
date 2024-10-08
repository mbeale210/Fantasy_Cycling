# app/models/team.py
from . import db

class FantasyTeam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    league_id = db.Column(db.Integer, db.ForeignKey('league.id'))
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)
    riders = db.relationship('Rider', backref='fantasy_team', lazy=True)