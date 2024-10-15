const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

// Setup CORS
const app = express();
app.use(cors()); // This line enables CORS

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect MongoDB', err);
});

// Your other routes and code...
