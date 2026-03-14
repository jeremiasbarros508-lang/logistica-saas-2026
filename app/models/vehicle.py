from datetime import datetime, timezone
from app import db


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    plate = db.Column(db.String(20), unique=True, nullable=False, index=True)
    model = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    year = db.Column(db.Integer)
    capacity_kg = db.Column(db.Float)
    capacity_m3 = db.Column(db.Float)
    status = db.Column(db.String(20), nullable=False, default='available')
    driver_name = db.Column(db.String(120))
    driver_phone = db.Column(db.String(30))
    current_location = db.Column(db.String(200))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    shipments = db.relationship('Shipment', backref='vehicle', lazy='dynamic',
                                foreign_keys='Shipment.vehicle_id')

    STATUS_CHOICES = ('available', 'in_use', 'maintenance', 'inactive')

    def to_dict(self):
        return {
            'id': self.id,
            'plate': self.plate,
            'model': self.model,
            'brand': self.brand,
            'year': self.year,
            'capacity_kg': self.capacity_kg,
            'capacity_m3': self.capacity_m3,
            'status': self.status,
            'driver_name': self.driver_name,
            'driver_phone': self.driver_phone,
            'current_location': self.current_location,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Vehicle {self.plate}>'
