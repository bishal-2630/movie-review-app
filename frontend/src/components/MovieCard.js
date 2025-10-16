import React from "react";
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

    const title = movie.title || movie.name;
    const posterPath = movie.poster_path;
    return (
        <Link to={`/movie/${movie.id}`
        } className="movie-card-link" >
            <div className="movie-card" >
                <div className="movie-poster-container">
                    {posterPath ? (
                        <img src={`${imageBaseUrl}${posterPath}`}
                            alt={title}
                            className="movie-poster"
                        />
                    ) : (
                        <div className="no-poster">
                            <span>No Image</span>
                        </div>
                    )}
                </div>
                <h3 className="movie-title">{title}</h3>
            </div>
        </Link >
    );
};

export default MovieCard;