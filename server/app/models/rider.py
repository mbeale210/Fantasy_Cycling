from app import db

class Rider(db.Model):
    __tablename__ = 'rider'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    rank = db.Column(db.Integer, nullable=False)
    career_points = db.Column(db.Integer, default=0)
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)
    is_gc = db.Column(db.Boolean, default=False)
    stage_results = db.relationship('StageResult', backref='rider', lazy=True)

    def __repr__(self):
        return f'<Rider {self.name}>'