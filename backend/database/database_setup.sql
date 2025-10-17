CREATE DATABASE IF NOT EXISTS movie_review_db;
USE movie_review_db;

CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    movie_title VARCHAR(255) NOT NULL,  
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_movie_id (movie_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

INSERT INTO users (email, username, hashed_password) VALUES
('test@example.com', 'testuser', '$2b$12$LQv3c1yqBWVHxkd0L6kZrOuSc2hM8l.pAIVQeBmC4E2cZjC.8Q1R.');

INSERT INTO reviews (movie_id, movie_title, user_id, title, rating, comment) VALUES 
(550, 'Fight Club', 1, 'Amazing Movie!', 5, 'One of the best movies I have ever seen. The acting was superb and the storyline was engaging.'),
(238, 'The Godfather', 1, 'Classic Film', 4, 'A timeless classic that everyone should watch at least once.');