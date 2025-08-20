const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate the user
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Add or update income
router.post('/', authenticate, async (req, res) => {
    const { amount, frequency } = req.body;
    const userId = req.userId;
    try {
        // Upsert: update if exists, else create
        let income = await Income.findOneAndUpdate(
            { userId },
            { amount, frequency },
            { new: true, upsert: true }
        );
        res.json(income);
    } catch (err) {
        console.error('Error saving income:', err);
        res.status(500).json({ error: 'Failed to save income' });
    }
});

// Get income for user
router.get('/', authenticate, async (req, res) => {
    const userId = req.userId;
    try {
        const income = await Income.findOne({ userId });
        res.json(income);
    } catch (err) {
        console.error('Error fetching income:', err);
        res.status(500).json({ error: 'Failed to fetch income' });
    }
});

module.exports = router;
