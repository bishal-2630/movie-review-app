import React, { useState } from "react";
import './ReviewForm.css';

const ReviewForm = ({ movie, onReviewSubmit, oncancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        rating: 5,
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.comment.trim()) {
            alert('Please fill in all fields');
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('Submitting review:', {
                movieId: movie.id,
                movieTitle: movie.title,
                ...formData
            });
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Review submitted successfully!');
            setFormData({ title: '', rating: 5, comment: '' });
            if (onReviewSubmit) {
                onReviewSubmit(formData);
            }
        } catch (error) {
            alert('Failed to submit review. Please try again.');
            console.error('Review submission error:', error);
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
                    <button className="close-button" onClick={oncancel}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="review-form">
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
                        />
                        <span className="char-count">{formData.comment.length}/100</span>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={oncancel}
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
            </div>
        </div>
    );
};

export default ReviewForm;


