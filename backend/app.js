const express = require("express");
const cors = require('cors');
const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/items', itemRoutes);

app.get('/', (req, res) => {
    res.send('This is backend server');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser){
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered succesfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = app;