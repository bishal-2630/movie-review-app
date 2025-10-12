
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.utils.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, nullable=False, index=True)
    movie_title = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)  
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
   
    user = relationship("User", back_populates="reviews")