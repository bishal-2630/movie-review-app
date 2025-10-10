import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';
import { Route, Routes } from 'react-router-dom';

function MovieCard({ movie }) {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    return (
        <div className="movie-card">
            {movie.poster_path && (
                <img
                    src={`${imageBaseUrl}${movie.poster_path}`}
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

            <p className="movie-overview"> {movie.overview
                ? (movie.overview.length > 150
                    ? movie.overview.substring(0, 150) + '...'
                    : movie.overview)
                : 'No descriptions available.'}
            </p>
            <button> Add Review </button>
        </div >
    );
}

function App() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_KEY = '9bcdb1078fa24262529f44ab427f223e';
    const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

    const searchMoviesFromAPI = useCallback(async (query) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1`);
            if (!response.ok) {
                throw new Error('Failed to search movies');
            }
            const data = await response.json();
            setMovies(data.results);
        } catch (error) {
            setError('Search Failed: ' + error.message);
            return [];
        }
    }, [API_KEY]);

    const handleSearch = async (searchQuery) => {
        setSearchTerm(searchQuery);
        if (searchQuery.trim() === '') {
            fetchMovies();
        } else {
            setLoading(true);
            const searchResults = await searchMoviesFromAPI(searchQuery);
            setMovies(searchResults);
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        fetchMovies();
    };

    const fetchMovies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            setMovies(data.results);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);


    if (loading) {
        return (
            <div className="App">
                <div className="loading">
                    <h2>Loading Movies...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="App">
                <div className="error">
                    <h2> Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchMovies} className='retry-button'>Retry</button>
                </div>
            </div >
        );
    }

    return (
        <div className="App">
            <Navbar
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                onClearSearch={clearSearch}
                resultsCount={movies.length}
            />

            <Routes>
                <Route path="/" element={
                    <Home
                        movies={movies}
                        loading={loading}
                        error={error}
                        fetchMovies={fetchMovies}
                        searchTerm={searchTerm}
                    />
                }
                />
            </Routes>

            <header className="app-header">
                <h1>
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Movies'}
                </h1>
                <p>
                    {searchTerm ? `Found ${movies.length} movies` : 'Discover Trending Movies'}
                </p>
                <button onClick={fetchMovies} className='refresh-button'>
                    {searchTerm ? 'Show Popular Movies' : 'Refresh Movies'}
                </button>
            </header>

            <div className="movies-container">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default App;