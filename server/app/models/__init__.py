from app import db

# Association tables
rider_fantasy_team = db.Table('rider_fantasy_team',
    db.Column('rider_id', db.Integer, db.ForeignKey('rider.id'), primary_key=True),
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_team.id'), primary_key=True),
    extend_existing=True  # Fix to avoid the duplicate table definition error
)

user_league = db.Table('user_league',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('league_id', db.Integer, db.ForeignKey('league.id'), primary_key=True),
    extend_existing=True  # Added here to avoid duplicate definition
)

# Import all models
from .user import User
from .rider import Rider
from .team import FantasyTeam
from .stage import Stage, StageResult
from .league import League

# Define relationships that require multiple models
User.leagues = db.relationship('League', secondary=user_league, back_populates='users')
League.users = db.relationship('User', secondary=user_league, back_populates='leagues')
Rider.fantasy_teams = db.relationship('FantasyTeam', secondary=rider_fantasy_team, back_populates='riders')
FantasyTeam.riders = db.relationship('Rider', secondary=rider_fantasy_team, back_populates='fantasy_teams')
