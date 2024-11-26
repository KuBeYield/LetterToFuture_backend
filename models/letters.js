// models/letters.js

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const lettersSchema = new mongoose.Schema({
    letterNumber: { type: Number },

    senderNumber: { type: Number, required: true },
    recipientNumber: { type: Number, required: true },

    title: { type: String, required: true },
    content: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    sendAt: { type: Date },

    isReadable: { type: Boolean, default: false },
    isChecked: { type: Boolean, default: false }
});

// Auto-increment 설정
lettersSchema.plugin(AutoIncrement, { inc_field: 'letterNumber' });

module.exports = mongoose.model('letters', lettersSchema);