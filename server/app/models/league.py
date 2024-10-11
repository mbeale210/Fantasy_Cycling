from app import db

class League(db.Model):
    __tablename__ = 'league'
    __table_args__ = {'extend_existing': True}  # Add this to avoid table redefinition errors

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    users = db.relationship('User', secondary='user_league', back_populates='leagues')

    def __repr__(self):
        return f'<League {self.name}>'
