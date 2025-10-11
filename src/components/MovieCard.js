import React from "react";
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

    const title = movie.title || movie.name;
    const posterPath = movie.poster_path;
    return (
        <div className="movie-card" >
            <div className="movie-poster-container">
                {posterPath && (
                    <img src={`${imageBaseUrl}${posterPath}`}
                        alt={title}
                        className="movie-poster"
                    />
                )}
            </div>
            <h3 className="movie-title">{title}</h3>
        </div>
    );
};

export default MovieCard;
