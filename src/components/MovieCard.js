import React from "react";
const MovieCard = ({ movie }) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    return (
        <div className="movie-card">
            {movie.poster_path && (
                <img src={`${imageBaseUrl}${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                />
            )}
            <h3>{movie.title}</h3>
            <p className="movie-year">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
            </p>
            <div className="movie-rating">
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</span>
            </div>
            <p className="movie-overview">
                {movie.overview ?
                    (movie.overview.length > 150 ?
                        `${movie.overview.substring(0, 150)}...` :
                        movie.overview
                    ) : 'No descriptions available'}
            </p>
            <button>Add Review</button>
        </div>
    );
};
export default MovieCard;
