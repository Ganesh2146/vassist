from datetime import datetime
from app.database import db

class Appointment(db.Model):
    __tablename__ = "appointments"

    appointment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    counselor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="scheduled", nullable=False)  # scheduled, confirmed, cancelled, completed
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('appointments_as_student', cascade='all, delete-orphan'))
    counselor = db.relationship('User', foreign_keys=[counselor_id], backref=db.backref('appointments_as_counselor', cascade='all, delete-orphan'))

    def to_dict(self, include_user=False, include_counselor=False):
        data = {
            "id": self.appointment_id,
            "user_id": self.user_id,
            "counselor_id": self.counselor_id,
            "date": self.date,
            "time": self.time,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_user and self.user:
            data["student"] = {
                "id": self.user.id,
                "name": f"{self.user.first_name} {self.user.last_name}",
                "email": self.user.email
            }
        
        if include_counselor and self.counselor:
            data["counselor_info"] = {
                "id": self.counselor.id,
                "name": f"{self.counselor.first_name} {self.counselor.last_name}",
                "email": self.counselor.email
            }
        
        return data
