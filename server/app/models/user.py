# app/models/user.py
from . import db

user_league = db.Table('user_league',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('league_id', db.Integer, db.ForeignKey('league.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    teams = db.relationship('FantasyTeam', backref='user', lazy=True)
    leagues = db.relationship('League', secondary=user_league, back_populates='users')
    drafted_riders = db.relationship('Rider', backref='drafted_by', lazy=True)