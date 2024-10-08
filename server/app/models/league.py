# app/models/league.py
from . import db

class League(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    users = db.relationship('User', secondary='user_league', back_populates='leagues')
    teams = db.relationship('FantasyTeam', backref='league', lazy=True)