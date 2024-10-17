const { required } = require('joi');
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500
    }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;