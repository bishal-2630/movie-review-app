import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVSeries from './pages/TvSeries';
import TopIMDB from './pages/TopImDb';
import MovieDetail from './pages/MovieDetail';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/Profile';
import './App.css';
import {
    Route, Routes
} from 'react-router-dom';

function App() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_KEY = '9bcdb1078fa24262529f44ab427f223e';
    const MOVIES_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

    const searchMoviesFromAPI = useCallback(async (query) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1`);
            if (!response.ok) {
                throw new Error('Failed to search movies');
            }
            const data = await response.json();
            return data.results || [];
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
            console.log('Fetching movies...')


            const response = await fetch(MOVIES_API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            setMovies(data.results || []);

        } catch (error) {
            setError(error.message);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, [MOVIES_API_URL]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    return (
        <AuthProvider>
            <div className="App">
                <div className='navbar-container'>
                    <Navbar
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        onClearSearch={clearSearch}
                        resultsCount={movies.length}
                    />
                </div>


                <Routes>
                    <Route path="/" element={
                        <Home
                            movies={movies}
                            loading={loading}
                            error={error}
                            fetchMovies={fetchMovies}
                            searchTerm={searchTerm}
                        />
                    } />
                    <Route path='/movies' element={<Movies />} />
                    <Route path='/tv-series' element={<TVSeries />} />
                    <Route path='/top-imdb' element={<TopIMDB />} />
                    <Route path="/movie/:id" element={<MovieDetail />} />
                    <Route path='/profile' element={<Profile />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;