from app import db

user_league = db.Table('user_league',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('league_id', db.Integer, db.ForeignKey('league.id'), primary_key=True)
)

class League(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    teams = db.relationship('FantasyTeam', backref='league', lazy=True)
    users = db.relationship('User', secondary=user_league, back_populates='leagues')
