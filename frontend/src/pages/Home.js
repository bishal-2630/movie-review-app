import React, { useState, useEffect, useCallback } from "react";
import MovieCarousel from "../components/MovieCarousel";
import MovieSection from "../components/MovieSection";
import './Home.css';
import MovieCard from "../components/MovieCard";

const Home = ({ movies, loading, error, fetchMovies, searchTerm }) => {
    const [tvSeries, setTvSeries] = useState([]);
    const [tvLoading, setTvLoading] = useState(false);

    const API_KEY = '9bcdb1078fa24262529f44ab427f223e';


    const fetchTvSeries = useCallback(async () => {
        try {
            setTvLoading(true);
            const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
            if (!response.ok) {
                throw new Error('Failed to fetch TV series');
            }
            const data = await response.json();
            setTvSeries(data.results || []);
        } catch (error) {
            console.error('Error fetching TV series:', error);
            setTvSeries([]);
        } finally {
            setTvLoading(false);
        }
    }, [API_KEY]);

    useEffect(() => {
        if (!searchTerm) {
            fetchTvSeries();
        }
    }, [searchTerm, fetchTvSeries]);

    if (loading && !searchTerm) {
        return (
            <div className="loading">
                <h2>Loading Movies...</h2>
                <div className="spinner"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="error">
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={fetchMovies} className="retry-button">Retry</button>
            </div>
        );
    }
    const safeMovies = Array.isArray(movies) ? movies : [];
    const safeTvSeries = Array.isArray(tvSeries) ? tvSeries : [];

    const topMovies = [...safeMovies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 5);

    const getSectionMovies = (sourceMovies, count = 16) => {
        const safeSource = Array.isArray(sourceMovies) ? sourceMovies : [];
        const shuffled = [...safeSource].sort(() => Math.random() - 0.5);
        if (shuffled.length < count) {
            const repeatedMovies = [];
            while (repeatedMovies.length < count) {
                repeatedMovies.push(...shuffled);
            }
            return repeatedMovies.slice(0, count);
        }
        return shuffled.slice(0, count);
    };

    const suggestions = getSectionMovies([...safeMovies], 16);
    const latestMovies = getSectionMovies([...safeMovies], 16);
    const tvSeriesData = getSectionMovies([...safeTvSeries], 16);

    if (searchTerm) {
        return (
            <div className="home-page">
                <header className="search-header">
                    <h1>Search Results for "{searchTerm}"
                    </h1>

                    <p>Found {safeMovies.length} movies</p>
                    <button onClick={fetchMovies} className="refresh-button">
                        Show Popular Movies
                    </button>
                </header>

                <div className="movies-grid">
                    {safeMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}

                </div>
            </div >
        );

    }
    return (
        <div className="home-page">
            <MovieCarousel movies={topMovies} />

            <div className="sections-container">
                <MovieSection
                    title="Suggestions For You"
                    movies={suggestions}
                />

                <MovieSection
                    title="Latest Movies"
                    movies={latestMovies}
                />


                {!tvLoading ? (
                    tvSeriesData.length > 0 && (
                        <MovieSection
                            title="TV Series"
                            movies={tvSeriesData}
                        />
                    )
                ) : (
                    <div className="loading">
                        <h2>Loading TV Series...</h2>
                        <div className="spinner"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;