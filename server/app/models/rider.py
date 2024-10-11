from . import db

rider_fantasy_team = db.Table('rider_fantasy_team',
    db.Column('rider_id', db.Integer, db.ForeignKey('rider.id'), primary_key=True),
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_team.id'), primary_key=True)
)

class Rider(db.Model):
    __tablename__ = 'rider'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    team = db.Column(db.String(100), nullable=False)
    career_points = db.Column(db.Integer, default=0)
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)
    is_gc = db.Column(db.Boolean, default=False)
    fantasy_teams = db.relationship('FantasyTeam', secondary=rider_fantasy_team, back_populates='riders')
    stage_results = db.relationship('StageResult', backref='rider', lazy=True)