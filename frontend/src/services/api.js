const API_BASE_URL = 'http://localhost:8000';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || '9bcdb1078fa24262529f44ab427f223e';

const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};


export const movieAPI = {
    getPopularMovies: async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        return response.json();
    },

    searchMovies: async (query) => {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${query}&page=1`
        );
        return response.json();
    },

    getMovieDetails: async (movieId) => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        return response.json();
    },

    getMovieCredits: async (movieId) => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
        );
        return response.json();
    }
};

export const authAPI = {
    register: async (userData) => {
        return apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    login: async (credentials) => {
        return apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
    getCurrentUser: async () => {
        return apiRequest('/api/auth/me');
    },
};

export const reviewAPI = {
    createReview: async (reviewData) => {
        return apiRequest('/api/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    },

    getMovieReviews: async (movieId) => {
        return apiRequest(`/api/reviews/movie/${movieId}`);
    },

    getUserReviews: async () => {
        return apiRequest('/api/reviews/user');
    },

    deleteReview: async (reviewId) => {
        return apiRequest(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
        });
    },
};

export const healthCheck = async () => {
    return apiRequest('/api/health');
};