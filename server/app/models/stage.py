from app import db

class Stage(db.Model):
    __tablename__ = 'stage'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    is_rest_day = db.Column(db.Boolean, default=False)
    results = db.relationship('StageResult', backref='stage', lazy=True)

    def __repr__(self):
        return f'<Stage {self.number}>'

class StageResult(db.Model):
    __tablename__ = 'stage_result'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    rider_id = db.Column(db.Integer, db.ForeignKey('rider.id'), nullable=False)
    stage_id = db.Column(db.Integer, db.ForeignKey('stage.id'), nullable=False)
    time = db.Column(db.Integer, nullable=False)  # Time in seconds
    sprint_pts = db.Column(db.Integer, default=0)
    mountain_pts = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<StageResult {self.id}>'
    