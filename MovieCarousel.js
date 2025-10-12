import React, { useState, useEffect } from "react";
import './MovieCarousel.css';

const MovieCarousel = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        if (movies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === movies.length - 1 ? 0 : prevIndex + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, [movies.length]);
    if (movies.length === 0) return null;
    const currentMovie = movies[currentIndex];
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    return (
        <div className="movie-carousel">
            <div
                className="carousel-slide"
                style={{
                    backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${imageBaseUrl}${currentMovie.backdrop_path})`
                }}
            >

                <div className="carousel-content">
                    <div className="carousel-text">
                        <h1 className="carousel-title">{currentMovie.title}</h1>
                        <p className="carousel-overview">{currentMovie.overview?.length > 200 ? currentMovie.overview.substring(0, 200) + '...' : currentMovie.overview
                        }
                        </p>
                        <div className="carousel-info">
                            <span className="carousel-rating">Rating: {currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : 'N/A'}/10</span>
                            <span className="carousel-year"> {currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : 'TBA'}</span>
                        </div>
                        <div className="carousel-buttons">
                            <button className="carousel-button watch-now">Watch Now</button>
                            <button className="carousel-button more-info">More Info</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="carousel-indicators">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator-button ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MovieCarousel;