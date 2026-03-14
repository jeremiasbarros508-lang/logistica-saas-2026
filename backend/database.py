from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration
DATABASE_URL = 'sqlite:///./test.db'  # Example for SQLite, change as needed

# Create the base class for declarative models
Base = declarative_base()

# Create a new SQLAlchemy engine instance
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get a session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()