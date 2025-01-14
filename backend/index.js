import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

// Create User
app.post('/api/users', (req, res) => {
    const { email_address, username, password } = req.body;
    const query = 'INSERT INTO users (email_address, username, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
    db.query(query, [email_address, username, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).json({ message: 'Error creating user' });
            return;
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    });
});

// Read all users
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ message: 'Error fetching users' });
            return;
        }
        res.status(200).json(results);
    });
});

// Read single user
app.get('/api/user/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE ID = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ message: 'Error fetching user' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(results[0]);
    });
});

// Update user
app.put('/api/user/:id', (req, res) => {
    const { id } = req.params;
    const { email_address, username, password } = req.body;
    const query = 'UPDATE users SET email_address = ?, username = ?, password = ?, updated_at = NOW() WHERE ID = ?';
    db.query(query, [email_address, username, password, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ message: 'Error updating user' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Delete user
app.delete('/api/user/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE ID = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ message: 'Error deleting user' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});