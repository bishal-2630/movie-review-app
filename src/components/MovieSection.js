import React from "react";
import MovieCard from "./MovieCard";
import './MovieSection.css';
const MovieSection = ({ title, movies, viewAllLink }) => {
    if (!movies || movies.length === 0) return null;
    return (
        <section className="movie-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                {viewAllLink && (
                    <a href={viewAllLink} className="view-all-button">View All
                    </a>
                )}
            </div>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </section >
    );
};

export default MovieSection;

