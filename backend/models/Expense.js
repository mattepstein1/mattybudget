const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
});

module.exports = mongoose.model('Expense', expenseSchema);