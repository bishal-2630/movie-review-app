import React from "react";
import MovieCard from "./MovieCard";
import './MovieSection.css';
const MovieSection = ({ title, movies, viewAllLink }) => {
    return (
        <section className="movie-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                {viewAllLink && (
                    <a href={viewAllLink} className="view-all-link">View All
                    </a>
                )}
            </div>
            <div className="horizontal-scroll-container">
                <div className="movies-horizontal">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MovieSection;

