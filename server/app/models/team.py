from . import db

class FantasyTeam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    league_id = db.Column(db.Integer, db.ForeignKey('league.id'))
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)
    trades_left = db.Column(db.Integer, default=2)
    riders = db.relationship('Rider', secondary='rider_fantasy_team', back_populates='fantasy_teams')
    active_gc_rider_id = db.Column(db.Integer, db.ForeignKey('rider.id'))
    active_gc_rider = db.relationship('Rider', foreign_keys=[active_gc_rider_id])
    active_domestiques = db.relationship('Rider', 
                                         secondary='active_domestiques',
                                         primaryjoin="and_(FantasyTeam.id==active_domestiques.c.fantasy_team_id, "
                                                     "active_domestiques.c.is_active==True)")
    bench_gc_riders = db.relationship('Rider', 
                                      secondary='bench_gc_riders',
                                      primaryjoin="and_(FantasyTeam.id==bench_gc_riders.c.fantasy_team_id, "
                                                  "bench_gc_riders.c.is_active==False)")
    bench_domestiques = db.relationship('Rider', 
                                        secondary='bench_domestiques',
                                        primaryjoin="and_(FantasyTeam.id==bench_domestiques.c.fantasy_team_id, "
                                                    "bench_domestiques.c.is_active==False)")

active_domestiques = db.Table('active_domestiques',
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_team.id'), primary_key=True),
    db.Column('rider_id', db.Integer, db.ForeignKey('rider.id'), primary_key=True),
    db.Column('is_active', db.Boolean, default=True)
)

bench_gc_riders = db.Table('bench_gc_riders',
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_team.id'), primary_key=True),
    db.Column('rider_id', db.Integer, db.ForeignKey('rider.id'), primary_key=True),
    db.Column('is_active', db.Boolean, default=False)
)

bench_domestiques = db.Table('bench_domestiques',
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_team.id'), primary_key=True),
    db.Column('rider_id', db.Integer, db.ForeignKey('rider.id'), primary_key=True),
    db.Column('is_active', db.Boolean, default=False)
)