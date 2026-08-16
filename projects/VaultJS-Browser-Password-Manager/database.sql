CREATE DATABASE IF NOT EXISTS vaultjs;
USE vaultjs;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,     
  salt VARCHAR(255) NOT NULL              -- Random salt per user.
);

CREATE TABLE IF NOT EXISTS vaults (
  user_id INT PRIMARY KEY,               -- Each user gets 1 row
  iv VARCHAR(255) NOT NULL,              -- Initialization Vector for AES
  data TEXT NOT NULL,                    -- The encrypted vault JSON
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE             
);
