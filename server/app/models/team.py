# app/models/team.py
from . import db

fantasy_team_stage_result = db.Table('fantasy_team_stage_result',
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_team.id'), primary_key=True),
    db.Column('stage_result_id', db.Integer, db.ForeignKey('stage_result.id'), primary_key=True)
)

class FantasyTeam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    league_id = db.Column(db.Integer, db.ForeignKey('league.id'))
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)
    riders = db.relationship('Rider', secondary=rider_fantasy_team, back_populates='fantasy_teams')
    stage_results = db.relationship('StageResult', secondary=fantasy_team_stage_result, back_populates='fantasy_teams')
