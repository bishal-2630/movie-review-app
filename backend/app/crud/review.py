# app/crud/review.py
from sqlalchemy.orm import Session

from app.models.review import Review
from app.schemas.review import ReviewCreate

def create_review(db: Session, review: ReviewCreate, user_id: int) -> Review:
    db_review = Review(
        **review.dict(),
        user_id=user_id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_by_movie(db: Session, movie_id: int) -> list[Review]:
    return db.query(Review).filter(Review.movie_id == movie_id).all()

def get_reviews_by_user(db: Session, user_id: int) -> list[Review]:
    return db.query(Review).filter(Review.user_id == user_id).all()

def get_review_by_id(db: Session, review_id: int) -> Review:
    return db.query(Review).filter(Review.id == review_id).first()

def delete_review(db: Session, review_id: int, user_id: int) -> bool:
    review = db.query(Review).filter(
        Review.id == review_id,
        Review.user_id == user_id
    ).first()
    
    if review:
        db.delete(review)
        db.commit()
        return True
    return False

def get_movie_review_stats(db: Session, movie_id: int) -> tuple[float, int]:
    reviews = get_reviews_by_movie(db, movie_id)
    if not reviews:
        return None, 0
    
    total_rating = sum(review.rating for review in reviews)
    average_rating = total_rating / len(reviews)
    return round(average_rating, 1), len(reviews)