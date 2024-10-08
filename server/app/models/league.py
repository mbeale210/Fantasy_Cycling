# app/models/league.py
from . import db

class League(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Creator of the league
    users = db.relationship('User', secondary='user_league', back_populates='leagues')
    teams = db.relationship('FantasyTeam', backref='league', lazy=True)