const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ['weekly', 'fortnightly', 'monthly'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Income', IncomeSchema);
