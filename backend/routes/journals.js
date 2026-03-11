const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const auth = require('../middleware/authMiddleware');

// Get all journals for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const journals = await Journal.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(journals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new journal
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newJournal = await Journal.create({
            userId: req.user.id,
            title,
            content,
        });
        res.json(newJournal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a journal
router.delete('/:id', auth, async (req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!journal) {
            return res.status(404).json({ error: 'Journal not found or not authorized' });
        }

        res.json({ message: 'Journal deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
