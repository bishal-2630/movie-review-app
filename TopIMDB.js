import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import './TopIMDB.css';

const TopIMDB = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const MOVIES_PER_PAGE = 20;

    const API_KEY = '9bcdb1078fa24262529f44ab427f223e';

    const fetchTopRatedMovies = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch top rated movies');
            }
            const data = await response.json();
            setMovies(data.results || []);
            setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
            setCurrentPage(data.page);

        } catch (error) {
            setError(error.message);
            setMovies([]);

        } finally {
            setLoading(false);
        }
    };
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            fetchTopRatedMovies(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchTopRatedMovies(1);
    }, []);

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let enPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (enPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.min(totalPages, startPage + maxVisiblePages + 1);
        }
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`pagination-button ${1 === currentPage ? 'active' : ''}`}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
            }
        }
        for (let i = startPage; i <= enPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-button ${i === currentPage ? 'active' : ''}`}
                >
                    {i}
                </button >
            );
        }

        if (enPage < totalPages) {
            if (enPage < totalPages - 1) {
                pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`pagination-button ${totalPages === currentPage ? 'active' : ''}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    if (loading && movies.length === 0) {
        return (
            <div className="top-imdb-page">
                <div className="loading" >
                    <h2>Loading Top Rated Movies...</h2>
                    <div className="spinner"></div>
                </div>
            </div >
        );
    }

    if (error && movies.length === 0) {
        return (
            <div className="top-imdb-page">
                <div className="error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={() => fetchTopRatedMovies(1)} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }
    return (
        <div className="top-imdb-page">
            <header className="top-imdb-header">
                <h1>Top Rated Movies</h1>
                <p> Discover the highest rated movies according to IMDB rating</p>
                <div className="page-info">
                    Page{currentPage} of {totalPages} • {movies.length} movies
                </div>
            </header>

            <div className="top-imdb-grid">
                {movies.map((movie, index) => (
                    <div key={movie.id} className="movie-card-wrapper">
                        <div className="movie-rank">#{((currentPage - 1) * MOVIES_PER_PAGE) + index + 1}</div>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button pagination-arrow">
                            &laquo; Prev
                        </button>
                        {renderPagination()}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="pagination-button pagination=arrow">
                            Next &raquo;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};



export default TopIMDB;
