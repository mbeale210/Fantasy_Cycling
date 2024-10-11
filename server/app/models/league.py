from app import db

class League(db.Model):
    __tablename__ = 'league'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    teams = db.relationship('FantasyTeam', backref='league', lazy=True)

    def __repr__(self):
        return f'<League {self.name}>'