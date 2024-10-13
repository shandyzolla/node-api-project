const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsobwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect MongoDB', err);
});

const itemSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true, 
      minlength: 3, 
      maxlength: 100 
    },
    description: { 
      type: String, 
      required: true, 
      minlength: 10, 
      maxlength: 500 
    }
  });  

const Item = mongoose.model('Item', itemSchema);

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: 'Terlalu banyak request'
});

app.use(limiter);

const itemSchemaJoi = new Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(500).required()
});

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send({ message: 'Akses ditolak, token tidak ada.' });

    jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
        if (err) return res.status(403).send({ message: 'Token tidak valid.' });
        req.user = user;
        next();
    });
}

const users = [];

// REGISTER
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    users.push(user);
    res.status(201).send({ message: 'User berhasil didaftarkan.' });
});

// LOGIN - Dapatkan Token JWT
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = user.find(u => u.username === username);
    if (!user) return res.status(404).send({ message: 'User tidak ditemukan' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({ message: 'Password salah' });

    const token = jwt.sign({ username: user.username }, 'your_jwt_secret_key', { expiresIn: '1h' });
    res.send({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
    res.send({ message: `Selamat datang ${req.user.username}. Kamu sudah terautentikasi.` });
})

// CREATE POST
app.post('/items', authenticateToken, async (req, res) => {
    const { error } = itemSchemaJoi.validate(req.body);
    if(error){
        return res.status(400).send({ message: error.details[0].message });
    }

    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).send(item);
    } catch (err) {
        res.status(500).send({ message: 'Failed to create item', error: err.message});
    }
});

// Read - GET
app.get('/items', authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    try {
      const items = await Item.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const totalItems = await Item.countDocuments();
      res.send({
        page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        data: items
      });
    } catch (err) {
      res.status(500).send({ message: 'Failed to fetch items', error: err.message });
    }
  });
  

// Update - PUT
app.put('/items/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({ message: 'ID tidak valid.' });
    }

    const { error } = itemSchemaJoi.validate(req.body);
    if (error){
        return res.status(400).send({ message: error.details[0].message });
    }
    
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!item){
            return res.status(404).send({ message: 'Item not found'});
        }        
        res.send(item);
    } catch (err) {
        res.status(500).send({ message: 'failed to update item', error: err.message});
    }
});

// DELETE
app.delete('/items/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({ message: 'ID tidak valid' });
    }
    
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item){
            return res.status(400).send({ message: 'Item not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).send({ message: 'Failed to delete item', error: err.message});
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})