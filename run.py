import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app, db
from app.models.user import User
from app.models.shipment import Shipment
from app.models.order import Order
from app.models.vehicle import Vehicle

app = create_app(os.environ.get('FLASK_ENV', 'production'))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
