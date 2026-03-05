const express = require('express');
const router = express.Router();
const pool = require('../database');
const auth = require('../middleware/authMiddleware');

// Get all journals for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const journals = await pool.query(
            'SELECT * FROM journals WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(journals.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new journal
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newJournal = await pool.query(
            'INSERT INTO journals (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, title, content]
        );
        res.json(newJournal.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a journal
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const journal = await pool.query(
            'SELECT * FROM journals WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (journal.rows.length === 0) {
            return res.status(404).json({ error: 'Journal not found or not authorized' });
        }

        await pool.query('DELETE FROM journals WHERE id = $1', [id]);
        res.json({ message: 'Journal deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
