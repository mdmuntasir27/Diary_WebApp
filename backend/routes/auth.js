const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user exists
        const userExists = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [username, passwordHash]
        );

        // Fetch the newly inserted row since SQLite doesn't support RETURNING like Postgres
        const result = await pool.query('SELECT id, username FROM users WHERE id = ?', [newUser.rows[0].id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.rows[0].id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
