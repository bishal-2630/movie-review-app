# app/schemas/review.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ReviewBase(BaseModel):
    movie_id: int
    movie_title: str
    title: str
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True

class MovieReviewsResponse(BaseModel):
    movie_id: int
    movie_title: str
    reviews: List[ReviewResponse]
    average_rating: Optional[float] = None
    total_reviews: int