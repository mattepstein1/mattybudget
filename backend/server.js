require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Ensure this file exists and is correctly implemented
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // This must be included before the routes

// MongoDB Connection
mongoose.connect('mongodb+srv://matthewepst:5uD69LvV6QX6m8DT@cluster0.2dg7ndz.mongodb.net/budgetApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes); // Ensure this route is implemented correctly
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));