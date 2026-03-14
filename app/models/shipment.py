from datetime import datetime, timezone
from app import db


class Shipment(db.Model):
    __tablename__ = 'shipments'

    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    origin = db.Column(db.String(200), nullable=False)
    destination = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(30), nullable=False, default='pending')
    weight_kg = db.Column(db.Float)
    volume_m3 = db.Column(db.Float)
    description = db.Column(db.Text)
    estimated_delivery = db.Column(db.DateTime)
    actual_delivery = db.Column(db.DateTime)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))

    STATUS_CHOICES = ('pending', 'in_transit', 'delivered', 'failed', 'cancelled', 'returned')

    @classmethod
    def generate_tracking_number(cls):
        import random
        import string
        while True:
            number = 'TL' + ''.join(random.choices(string.digits, k=10))
            if not cls.query.filter_by(tracking_number=number).first():
                return number

    def to_dict(self):
        return {
            'id': self.id,
            'tracking_number': self.tracking_number,
            'origin': self.origin,
            'destination': self.destination,
            'status': self.status,
            'weight_kg': self.weight_kg,
            'volume_m3': self.volume_m3,
            'description': self.description,
            'estimated_delivery': self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            'actual_delivery': self.actual_delivery.isoformat() if self.actual_delivery else None,
            'assigned_to': self.assigned_to,
            'vehicle_id': self.vehicle_id,
            'order_id': self.order_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<Shipment {self.tracking_number}>'
