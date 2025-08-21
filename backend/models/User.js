const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Store hashed passwords
    hideIncome: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);