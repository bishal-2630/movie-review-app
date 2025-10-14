
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';
import './Navbar.css';

const Navbar = ({ searchTerm, onSearchChange, onClearSearch, resultsCount }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const handleSignInClick = (mode = 'login') => {
        setAuthMode(mode);
        setShowAuthModal(true);
    };
    const handleLogout = () => {
        logout();
    };


    return (
        <>
            <nav className="navbar">
                <div className="nav-brand">
                    <Link to="/">MovieApp</Link>
                </div>

                <div className="nav-links">
                    <Link to="/" className="nav-link">HOME</Link>
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

                        <span className="results-count">{resultsCount} {resultsCount === 1 ? 'result' : 'results'} </span>
                    </div>
                    {isAuthenticated ? (
                        <div className='user-menu'>
                            <span className='welcome-text'>Welcome, {user?.username}</span>
                            <button className='sign-in-button' onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className='auth-buttons'>
                            <button className='sign-in-button' onClick={handleSignInClick}>
                                Sign In
                            </button>
                            <button className='sign-up-button' onClick={() => handleSignInClick('register')}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <AuthModals
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Navbar;