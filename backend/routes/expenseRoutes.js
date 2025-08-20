const express = require('express');
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use env variable for JWT secret

// Middleware to authenticate the user
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id; // Attach the userId to the request object
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Add Expense
router.post('/', authenticate, async (req, res) => {
    const { title, description, amount, date } = req.body;
    const userId = req.userId; // Extracted from the token

    try {
        const expense = new Expense({ userId, title, description, amount, date });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        console.error('Error adding expense:', err);
        res.status(400).json({ error: 'Failed to add expense' });
    }
});

// Get Expenses for Logged-in User
router.get('/', authenticate, async (req, res) => {
    const userId = req.userId; // Extracted from the token

    try {
        const expenses = await Expense.find({ userId }); // Fetch expenses for the logged-in user
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Update Expense
router.put('/:id', authenticate, async (req, res) => {
    const expenseId = req.params.id;
    const userId = req.userId;
    const { title, description, amount, date } = req.body;

    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, userId },
            { title, description, amount, date },
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found or not authorized to update' });
        }
        res.json(expense);
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

// Delete Expense
router.delete('/:id', authenticate, async (req, res) => {
    const expenseId = req.params.id;
    const userId = req.userId;

    try {
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found or not authorized to delete' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

module.exports = router;