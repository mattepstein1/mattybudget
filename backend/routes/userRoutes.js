const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Ensure this model exists

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use env variable for JWT secret

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({ username, password: hashedPassword }); // Save the hashed password
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    username = username.toLowerCase();
    console.log('Login request:', { username, password }); // Log the incoming request

    try {
        const user = await User.findOne({ username });
        console.log('User found:', user); // Log the user data from the database

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid); // Log the password comparison result

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error during login:', err); // Log any server errors
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout (optional, placeholder)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Get hideIncome field for logged-in user
router.get('/hide-income', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ hideIncome: user.hideIncome });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update hideIncome field for logged-in user
router.patch('/hide-income', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });
        const decoded = jwt.verify(token, JWT_SECRET);
        const { hideIncome } = req.body;
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.hideIncome = !!hideIncome;
        await user.save();
        res.json({ hideIncome: user.hideIncome });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;