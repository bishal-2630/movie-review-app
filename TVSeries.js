import React, { useState, useEffect } from "react";
import MovieCard from '../components/MovieCard';
import './TVSeries.css';

const TVSeries = () => {
    const [tvSeries, setTvSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_KEY = '9bcdb1078fa24262529f44ab427f223e';

    const fetchTVSeries = async (pageNum = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=${pageNum}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch TV series');
            }
            const data = await response.json();
            setTvSeries(prevSeries =>
                pageNum === 1 ? data.results : [...prevSeries, ...data.results]
            );
            setTotalPages(data.total_pages);
            setPage(data.page);

        } catch (error) {
            setError(error.message);
            setTvSeries([]);

        } finally {
            setLoading(false);
        }
    };
    const loadMore = () => {
        if (page < totalPages && !loading) {
            fetchTVSeries(page + 1);
        }
    };

    useEffect(() => {
        fetchTVSeries(1);
    }, []);
    if (loading && tvSeries.length === 0) {
        return (
            <div className="tvseries-page">
                <div className="loading">
                    <h2>Loading TV Series...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error && tvSeries.length === 0) {
        return (
            <div className="tvseries-page">
                <div className="error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={() => fetchTVSeries(1)} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }
    return (
        <div className="tvseries-page">
            <header className="tvseries-header">
                <h1>Popular TV Series</h1>
                <p> Disover the most popular TV shows and series</p>
            </header>
            <div className="tvseries-grid">
                {tvSeries.map((series) => (
                    <MovieCard key={series.id} movie={series} />
                ))}
            </div>
            {loading && tvSeries.length > 0 && (
                <div className="loading-error">
                    <div className="spinner"></div>
                    <p>Loading more TV series...</p>
                </div>
            )}
            {!loading && page < totalPages && (
                <div className="load-more-content">
                    <button onClick={loadMore} className="load-more-button">Load More Series</button>
                </div>
            )}
            {!loading && tvSeries.length > 0 && page >= totalPages && (
                <div className="end-message">
                    <p>You've reached the end of the list</p>
                </div>
            )}
        </div>
    );
};

export default TVSeries;