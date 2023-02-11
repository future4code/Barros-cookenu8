-- Active: 1675806971305@@35.226.146.116@3306@jbl-4416465-maria-ferro
CREATE TABLE IF NOT EXISTS Users_Cookenu (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipes_Cookenu (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (author_id) REFERENCES Users_Cookenu (id)
);

CREATE TABLE IF NOT EXISTS Users_Followers_Cookenu (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    following_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users_Cookenu (id),
    FOREIGN KEY (following_id) REFERENCES Users_Cookenu (id)
)