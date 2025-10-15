
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVSeries from './pages/TvSeries';
import TopIMDB from './pages/TopImDb';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { movieAPI } from './services/api';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMovies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching popular movies...');

            const data = await movieAPI.getPopularMovies();
            setMovies(data.results || []);

        } catch (error) {
            setError(error.message);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = async (searchQuery) => {
        setSearchTerm(searchQuery);
        if (searchQuery.trim() === '') {
            fetchMovies();
        } else {
            setLoading(true);
            try {
                const data = await movieAPI.searchMovies(searchQuery);
                setMovies(data.results || []);
            } catch (error) {
                setError('Search failed: ' + error.message);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        fetchMovies();
    };

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    return (
        <Router>
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
                        <Route path="*" element={<Home />} />
                    </Routes>
                </div>
            </AuthProvider >
        </Router>
    );
}

export default App;