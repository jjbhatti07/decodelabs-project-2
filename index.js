const express = require('express');
const Database = require('better-sqlite3');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ============================
// Setup SQLite Database
// ============================
const db = new Database('decodelabs.db');

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    age INTEGER NOT NULL CHECK(age >= 0),
    is_active INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

console.log('Connected to SQLite database!');

// ============================
// ROUTES
// ============================

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running!" });
});

// GET all users
app.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET single user by ID
app.get('/users/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST - create new user
app.post('/users', (req, res) => {
  try {
    const { email, age } = req.body;

    if (!email || !age) {
      return res.status(400).json({ error: "Email and age are required" });
    }

    const stmt = db.prepare('INSERT INTO users (email, age) VALUES (?, ?)');
    const result = stmt.run(email, age);

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newUser);

  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// PUT - update user
app.put('/users/:id', (req, res) => {
  try {
    const { email, age, is_active } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    db.prepare('UPDATE users SET email = ?, age = ?, is_active = ? WHERE id = ?')
      .run(
        email || user.email,
        age || user.age,
        is_active !== undefined ? is_active : user.is_active,
        req.params.id
      );

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    res.status(200).json(updatedUser);

  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - delete user
app.delete('/users/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.status(204).send();

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});