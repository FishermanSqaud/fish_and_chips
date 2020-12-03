SET NAMES utf8;
SET character_set_client = utf8mb4;
SET character_set_server = utf8mb4;

CREATE DATABASE IF NOT EXISTS fish_and_chips;

USE fish_and_chips;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER AUTO_INCREMENT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    is_admin TINYINT DEFAULT 0,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS reports (
    id INTEGER AUTO_INCREMENT NOT NULL,
    spam_domain TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS authenticated_domains (  
    id INTEGER AUTO_INCREMENT NOT NULL,
    domain TEXT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
