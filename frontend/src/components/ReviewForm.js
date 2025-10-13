import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { reviewAPI } from '../services/api';
import './ReviewForm.css';

const ReviewForm = ({ movie, onReviewSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        rating: 5,
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { isAuthenticated, user } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setError('Please login to submit a review');
        }

        if (!formData.title.trim() || !formData.comment.trim()) {
            alert('Please fill in all fields');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const reviewData = {
                movieId: movie.id,
                movieTitle: movie.title,
                title: formData.title,
                rating: formData.rating,
                comment: formData.comment
            };

            const response = await reviewAPI.createReview(reviewData);


            setFormData({ title: '', rating: 5, comment: '' });
            setError('');

            if (onReviewSubmit) {
                onReviewSubmit(response);
            }
        } catch (error) {
            console.error('Review submission error:', error);
            setError(error.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingOptions = [1, 2, 3, 4, 5];
    return (
        <div className="review-form-overlay">
            <div className="review-form-container">
                <div className="review-form-header">
                    <h2>Write a review</h2>
                    <p>for <strong>{movie.title}</strong></p>
                    {isAuthenticated && (
                        <p className="user-info">Posting as: {user?.username}</p>
                    )}

                    <button button className="close-button" onClick={onCancel}>×</button>
                </div>

                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="review-form">
                    </form>
                ) : (
                    <div div className="auth-required">
                        <p>You need to be logged into write a review</p>
                        <button className="login-prompt-button" onClick={onCancel}>
                            Go to Login
                        </button>
                    </div>
                )}
                {isAuthenticated && (
                    <form form onSubmit={handleSubmit} className="review-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="rating">Your Rating*</label>
                            <div className="rating-selector">
                                {ratingOptions.map(stars => (
                                    <label key={stars} className="rating-option">
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={stars}
                                            checked={formData.rating === stars}
                                            onChange={handleChange}
                                        />
                                        <span className="rating-stars">
                                            {'⭐'.repeat(stars)}
                                            <span className="rating-number">({stars})</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Review Title*</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your review a title"
                                maxLength="100"
                                required
                                disabled={isSubmitting}
                            />

                            <span className="char-count">{formData.title.length}/100</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">Your Review*</label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Share your thoughts about this movie... What did you like or dislike?"
                                rows="6"
                                maxLength="1000"
                                required
                                disabled={isSubmitting}
                            />
                            <span className="char-count">{formData.comment.length}/100</span>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="cancel-button"
                                disabled={isSubmitting}
                            >
                                cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner-small"></div>Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div >
        </div >
    );
};

export default ReviewForm;


