CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    country_code CHAR(2),
    language_code VARCHAR(10) DEFAULT 'en-EN',
    birthday_date DATE DEFAULT NULL,
    last_ip VARCHAR(45) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE,
    banned BOOLEAN DEFAULT FALSE,
    role ENUM('user', 'admin', 'beta') NOT NULL DEFAULT 'user',
    last_login_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);