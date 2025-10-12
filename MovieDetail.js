// src/pages/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cast, setCast] = useState([]);
    // const [reviews, setReviews] = useState([]);

    const API_KEY = '9bcdb1078fa24262529f44ab427f223e';

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);


                const movieResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
                );

                if (!movieResponse.ok) {
                    throw new Error('Failed to fetch movie details');
                }

                const movieData = await movieResponse.json();
                setMovie(movieData);


                const castResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
                );

                if (castResponse.ok) {
                    const castData = await castResponse.json();
                    setCast(castData.cast.slice(0, 10));
                }


                // setReviews([]);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="movie-detail-page">
                <div className="loading">
                    <h2>Loading Movie Details...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="movie-detail-page">
                <div className="error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-button">Back to Home</Link>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="movie-detail-page">
                <div className="error">
                    <h2>Movie not found</h2>
                    <Link to="/" className="back-button">Back to Home</Link>
                </div>
            </div>
        );
    }

    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    const backdropUrl = "https://image.tmdb.org/t/p/w1280";

    return (
        <div className="movie-detail-page">

            <div
                className="movie-backdrop"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${backdropUrl}${movie.backdrop_path})`
                }}
            >
                <div className="backdrop-content">
                    <Link to="/" className="back-button">← Back to Home</Link>

                    <div className="movie-hero">
                        <div className="poster-section">
                            <img
                                src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : '/placeholder-poster.jpg'}
                                alt={movie.title}
                                className="movie-poster-large"
                            />
                        </div>

                        <div className="movie-info">
                            <h1 className="movie-title">{movie.title}</h1>

                            <div className="movie-meta">
                                <span className="rating">
                                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                                </span>
                                <span className="year">
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                                </span>
                                <span className="runtime">
                                    {movie.runtime ? `${movie.runtime} min` : 'N/A'}
                                </span>
                            </div>

                            <div className="genres">
                                {movie.genres?.map(genre => (
                                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                                ))}
                            </div>

                            <p className="movie-overview">{movie.overview}</p>

                            <div className="action-buttons">
                                <button className="watch-trailer">🎬 Watch Trailer</button>
                                <button className="add-review">✍️ Write Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="movie-details-content">

                <section className="cast-section">
                    <h2>Cast</h2>
                    <div className="cast-grid">
                        {cast.map(person => (
                            <div key={person.id} className="cast-card">
                                <img
                                    src={person.profile_path ? `${imageBaseUrl}${person.profile_path}` : '/placeholder-avatar.jpg'}
                                    alt={person.name}
                                    className="cast-photo"
                                />
                                <div className="cast-info">
                                    <h4>{person.name}</h4>
                                    <p>{person.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                <section className="reviews-section">
                    <h2>Reviews</h2>
                    <div className="reviews-placeholder">
                        <p>Review functionality coming soon!</p>
                        <p>Users will be able to write and read reviews here.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MovieDetail;