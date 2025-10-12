
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_current_active_user
from app.crud.review import (
    create_review, get_reviews_by_movie, get_reviews_by_user, 
    delete_review, get_movie_review_stats
)
from app.crud.user import get_user_by_id
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse, MovieReviewsResponse
from app.utils.database import get_db

router = APIRouter()

@router.post("", response_model=ReviewResponse)
def create_review_endpoint(
    review: ReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    db_review = create_review(db=db, review=review, user_id=current_user.id)
    
    return ReviewResponse(
        id=db_review.id,
        movie_id=db_review.movie_id,
        movie_title=db_review.movie_title,
        title=db_review.title,
        rating=db_review.rating,
        comment=db_review.comment,
        user_id=current_user.id,
        username=current_user.username,
        created_at=db_review.created_at
    )

@router.get("/movie/{movie_id}", response_model=MovieReviewsResponse)
def get_reviews_for_movie(movie_id: int, db: Session = Depends(get_db)):
    reviews = get_reviews_by_movie(db, movie_id=movie_id)
    
    review_responses = []
    for review in reviews:
        user = get_user_by_id(db, review.user_id)
        review_responses.append(
            ReviewResponse(
                id=review.id,
                movie_id=review.movie_id,
                movie_title=review.movie_title,
                title=review.title,
                rating=review.rating,
                comment=review.comment,
                user_id=user.id,
                username=user.username,
                created_at=review.created_at
            )
        )
    
    average_rating, total_reviews = get_movie_review_stats(db, movie_id)
    movie_title = reviews[0].movie_title if reviews else f"Movie {movie_id}"
    
    return MovieReviewsResponse(
        movie_id=movie_id,
        movie_title=movie_title,
        reviews=review_responses,
        average_rating=average_rating,
        total_reviews=total_reviews
    )

@router.get("/user", response_model=List[ReviewResponse])
def get_user_reviews(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    reviews = get_reviews_by_user(db, user_id=current_user.id)
    
    review_responses = []
    for review in reviews:
        review_responses.append(
            ReviewResponse(
                id=review.id,
                movie_id=review.movie_id,
                movie_title=review.movie_title,
                title=review.title,
                rating=review.rating,
                comment=review.comment,
                user_id=current_user.id,
                username=current_user.username,
                created_at=review.created_at
            )
        )
    
    return review_responses

@router.delete("/{review_id}")
def delete_review_endpoint(
    review_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    success = delete_review(db, review_id=review_id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found or you don't have permission to delete it"
        )
    
    return {"message": "Review deleted successfully"}