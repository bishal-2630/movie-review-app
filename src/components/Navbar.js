// Navbar.js - Fixed version
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ searchTerm, onSearchChange, onClearSearch, resultsCount }) => {
    return (
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
        </nav >
    );
};

export default Navbar;