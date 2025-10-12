from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class MovieBase(BaseModel):
    tmdb_id: int
    title: str
    overview: Optional[str] = None
    release_date: Optional[date] = None
    poster_path: Optional[str] = None
    rating: Optional[float] = None

class MovieCreate(MovieBase):
    pass

class MovieResponse(MovieBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True