// models/users.js

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const usersSchema = new mongoose.Schema({
    userNumber: { type: Number },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    password: { type: String, required: true },
});

// Auto-increment 설정
usersSchema.plugin(AutoIncrement, { inc_field: 'userNumber' });

module.exports = mongoose.model('users', usersSchema);