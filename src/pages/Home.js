import React from "react";
import MovieCarousel from "../components/MovieCarousel";
import MovieSection from "../components/MovieSection";
import './Home.css';
import MovieCard from "../components/MovieCard";

const Home = ({ movies, loading, error, fetchMovies,
    searchTerm }) => {
    if (loading) {
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

    const topMovies = [...movies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 5);

    const suggestions = [...movies].sort(() => Math.random() - 0.5)
        .slice(0, 8);
    const latestMovies = [...movies].sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 8);
    const tvSeries = [...movies].sort(() => Math.random() - 0.5)
        .slice(0, 8);
    if (searchTerm) {


        return (
            <div className="home-page">
                <header className="search-header">
                    <h1>Search Results for "{searchTerm}"
                    </h1>

                    <p>Found {movies.length} movies</p>
                    <button onClick={fetchMovies} className="refresh-button">
                        Show Popular Movies
                    </button>
                </header>

                <div className="movie-grid">
                    {movies.map((movie) => (
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
                    viewAllLink="/suggestions"
                />

                <MovieSection
                    title="Latest Movies"
                    movies={latestMovies}
                    viewAllLink="/movies"
                />

                <MovieSection
                    title="TV Series"
                    movies={tvSeries}
                    viewAllLink="/tv-series"
                />
            </div>
        </div>
    );
};
export default Home;