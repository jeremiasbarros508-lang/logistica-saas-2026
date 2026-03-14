import os
import click
from dotenv import load_dotenv

load_dotenv()

from app import create_app, db
from app.models.user import User
from app.models.shipment import Shipment
from app.models.order import Order
from app.models.vehicle import Vehicle

app = create_app(os.environ.get('FLASK_ENV', 'development'))


@app.cli.command('create-db')
def create_db():
    """Create all database tables."""
    db.create_all()
    click.echo('Database tables created.')


@app.cli.command('seed-db')
def seed_db():
    """Seed the database with sample data."""
    # Create admin user
    if not User.query.filter_by(email='admin@techlogistics.com').first():
        admin = User(name='Admin', email='admin@techlogistics.com', role='admin')
        admin.set_password('admin1234')
        db.session.add(admin)

    # Create manager user
    if not User.query.filter_by(email='manager@techlogistics.com').first():
        manager = User(name='Manager', email='manager@techlogistics.com', role='manager')
        manager.set_password('manager1234')
        db.session.add(manager)

    # Create a sample vehicle
    if not Vehicle.query.filter_by(plate='TL-0001').first():
        vehicle = Vehicle(
            plate='TL-0001',
            brand='Ford',
            model='Transit',
            year=2022,
            capacity_kg=1500.0,
            capacity_m3=10.0,
            driver_name='João Silva',
            driver_phone='+55 11 99999-0001',
        )
        db.session.add(vehicle)

    db.session.commit()
    click.echo('Database seeded with sample data.')
    click.echo('  Admin:   admin@techlogistics.com / admin1234')
    click.echo('  Manager: manager@techlogistics.com / manager1234')


@app.cli.command('drop-db')
def drop_db():
    """Drop all database tables."""
    if click.confirm('This will delete ALL data. Are you sure?'):
        db.drop_all()
        click.echo('Database tables dropped.')


if __name__ == '__main__':
    app.run()
