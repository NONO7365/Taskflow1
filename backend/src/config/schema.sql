CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE boards (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE columns (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  position   INTEGER NOT NULL,
  board_id   INTEGER REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TABLE cards (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  position    INTEGER NOT NULL,
  column_id   INTEGER REFERENCES columns(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW()
);