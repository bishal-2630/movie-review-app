import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';
import './Navbar.css';

const Navbar = ({ searchTerm, onSearchChange, onClearSearch, resultsCount, isSearching }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignInClick = (mode = 'login') => {
        setAuthMode('login');
        setShowAuthModal(true);
    };

    const handleRegisterClick = () => {
        setAuthMode('register');
        setShowAuthModal(true);
    };


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleHomeClick = () => {
        // Clear search first
        if (onClearSearch) {
            onClearSearch();
        }

        if (location.pathname !== '/') {
            navigate('/');
        } else {

            window.scrollTo(0, 0);

            if (window.location.search.includes('search')) {
                window.history.replaceState({}, '', '/');
            }
        }
    };

    const shouldShowResultsCount = searchTerm && resultsCount > 0 && isSearching;

    return (
        <>
            <nav className="navbar">
                <div className="nav-brand">
                    <Link to="/" onClick={handleHomeClick}>MovieApp</Link>
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link" onClick={handleHomeClick}>HOME</Link>
                    <Link to="/genres" className="nav-link">GENRES</Link>
                    <Link to="/movies" className="nav-link">MOVIES</Link>
                    <Link to="/tv-series" className="nav-link">TV-SERIES</Link>
                    <Link to="/top-imdb" className="nav-link">TOP IMDB</Link>
                </div>
                <div className='nav-right'>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className='search-input'
                        />
                        {searchTerm && (
                            <button onClick={onClearSearch}
                                className='clear-button'
                                title='Clear search'>Clear</button>
                        )}
                        {shouldShowResultsCount && (
                            <span span className="results-count">{resultsCount} {resultsCount === 1 ? 'match' : 'matches'}
                            </span>
                        )}
                        {isSearching && searchTerm && (
                            <span className='searching-indicator'>🔍 Searching...</span>
                        )}
                    </div>

                    {isAuthenticated ? (
                        <div className='user-menu'>
                            <span className='welcome-text'>Welcome, {user?.username}</span>
                            <Link to="/profile" className='profile-link'>
                                Profile
                            </Link>
                            <button className='sign-in-button' onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className='auth-buttons'>
                            <button className='sign-in-button' onClick={handleSignInClick}>
                                Sign In
                            </button>
                            <button className='register-button' onClick={handleRegisterClick}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </nav >

            <AuthModals
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Navbar;