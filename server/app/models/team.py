from app import db

rider_fantasy_team = db.Table('rider_fantasy_team',
    db.Column('rider_id', db.Integer, db.ForeignKey('rider.id'), primary_key=True),
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_team.id'), primary_key=True)
)

class FantasyTeam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    league_id = db.Column(db.Integer, db.ForeignKey('league.id'), nullable=False)
    active_gc_rider_id = db.Column(db.Integer, db.ForeignKey('rider.id'))
    trades_left = db.Column(db.Integer, default=30)
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)
    riders = db.relationship('Rider', secondary=rider_fantasy_team, back_populates='fantasy_teams')