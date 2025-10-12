import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import './Movies.css';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const API_KEY = '9bcdb1078fa24262529f44ab427f223e';

    const fetchMovies = async (pageNum = 1) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNum}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            setMovies(prevMovies =>
                pageNum === 1 ? data.results : [...prevMovies, ...data.results]
            );
            setTotalPages(data.total_pages);
            setPage(data.page);
        } catch (error) {
            setError(error.message);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (page < totalPages && !loading) {
            fetchMovies(page + 1);
        }
    };

    useEffect(() => {
        fetchMovies(1);
    }, []);

    if (loading && movies.length === 0) {
        return (
            <div className='movies-page'>
                <div className='loading'>
                    <h2>Loading Movies...</h2>
                    <div className='spinner'></div>
                </div>
            </div>
        );
    }

    if (error && movies.length === 0) {
        return (
            <div className='movies-page'>
                <div className='error'>
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={() => fetchMovies(1)} className='retry-button'>
                        Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className='movies-page'>
            <header className='movies-header'>
                <h1>All Movies</h1>
                <p>Discover the most popular movies</p>
            </header>

            <div className='movies-grid'>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {loading && movies.length > 0 && (
                <div className='loading-more'>
                    <div className='spinner'></div>
                    <p>Loading more movies...</p>
                </div>
            )}

            {!loading && page < totalPages && (
                <div className='load-more-container'>
                    <button onClick={loadMore} className='load-more-button'>
                        Load More Movies
                    </button>
                </div>
            )}

            {!loading && movies.length > 0 && page >= totalPages && (
                <div className='end-message'>
                    <p>You've reached the end of the list!</p>
                </div>
            )}
        </div>
    );
};
export default Movies;