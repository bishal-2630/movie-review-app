import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: for styling

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [resultsCount, setResultsCount] = useState(0);

    const onSearchChange = (value) => {
        setSearchTerm(value);
        // You can update resultsCount here based on search results
        // setResultsCount(filteredResults.length);
    };

    const onClearSearch = () => {
        setSearchTerm('');
        setResultsCount(0);
    };

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