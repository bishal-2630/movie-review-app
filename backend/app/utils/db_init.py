from app.utils.database import engine, Base
from app.models.user import User
from app.models.review import Review

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully")

if __name__ == "__main__":
    init_db()