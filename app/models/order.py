from datetime import datetime, timezone
from app import db


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120))
    customer_phone = db.Column(db.String(30))
    pickup_address = db.Column(db.String(200), nullable=False)
    delivery_address = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(30), nullable=False, default='new')
    priority = db.Column(db.String(20), default='normal')
    notes = db.Column(db.Text)
    total_value = db.Column(db.Float, default=0.0)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    shipments = db.relationship('Shipment', backref='order', lazy='dynamic',
                                foreign_keys='Shipment.order_id')

    STATUS_CHOICES = ('new', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')
    PRIORITY_CHOICES = ('low', 'normal', 'high', 'urgent')

    @classmethod
    def generate_order_number(cls):
        import random
        import string
        while True:
            number = 'ORD' + ''.join(random.choices(string.digits, k=8))
            if not cls.query.filter_by(order_number=number).first():
                return number

    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'pickup_address': self.pickup_address,
            'delivery_address': self.delivery_address,
            'status': self.status,
            'priority': self.priority,
            'notes': self.notes,
            'total_value': self.total_value,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<Order {self.order_number}>'
