import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { reviewAPI } from "../services/api";
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUserReviews = async () => {
        try {
            setLoading(true);
            const reviewsData = await reviewAPI.getUserReviews();
            setUserReviews(reviewsData.reviews || []);
        } catch (error) {
            console.error('Failed to fetch user reviews:', error);
            setError('Failed to load your reviews');
            setUserReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await reviewAPI.deleteReview(reviewId);
                setUserReviews(prev => prev.filter(review => review.id !== reviewId));
            } catch (error) {
                console.error('Failed to delete review:', error);
                alert('Failed to delete review');
            }
        }
    };
    useEffect(() => {
        if (user) {
            fetchUserReviews();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="profile-page">
                <div className="not-logged-in">
                    <h2>Please login to view your profile</h2>
                    <p>You need to be authenticated to acces this page.</p>
                    <Link to="/" className="home-button">Go to Home</Link>
                </div>
            </div>
        );
    }
    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button onClick={logout} className="logout-button">
                    Logout</button>
            </div>
            <div className="user-info-card">
                <div className="user-avatar">
                    {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                    <h2>Welcome, {user.username}!</h2>
                    <p className="user-email">{user.email}</p>
                    <p className="member-since">Member since {new Date(user.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="reviews-section">
                <div className="section-header">
                    <h3>My Reviews</h3>

                    <span className="reviews-count">({userReviews.length} reviews)</span>
                </div>
                {loading ? (
                    <div className="loading-reviews">
                        <div className="spinner"></div>
                        <p>Loading your reviews...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={fetchUserReviews} className="retry-button">
                            Try Again
                        </button>
                    </div>
                ) : userReviews.length > 0 ? (
                    <div className="reviews-list">
                        {userReviews.map((review) => (
                            <div key={review.id} className="review-card">

                                <div className="review-header">
                                    <div className="review-movie-info">
                                        <h4>
                                            <Link to={`/movie/${review.movie_id}`} className="movie-link">
                                                {review.movie_title || `Movie #${review.movie_id}`}
                                            </Link>
                                        </h4>
                                        <div className="review-rating">
                                            {'⭐'.repeat(review.rating)}
                                            <span>({review.rating}/5)</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteReview(review.id)}
                                        className="delete-review-button"
                                        title="Delete review">
                                        🗑️
                                    </button>
                                </div>

                                <h5 className="review-title">{review.title}</h5>
                                <p className="review-comment">{review.comment}</p>

                                <div className="review-meta">
                                    <span className="review-date">
                                        Reviewed on {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-reviews">
                        <div className="no-reviews-icon">📝</div>
                        <h4>No reviews yet</h4>
                        <p>You haven't written any reviews. Start sharing your thoughts on movies!</p>
                        <Link to="/" className="browse-movies-button">
                            Browse Movies
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;