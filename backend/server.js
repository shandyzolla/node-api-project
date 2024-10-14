const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware CORS untuk mengizinkan akses dari frontend
app.use(cors());  // Mengizinkan semua domain mengakses (untuk development)

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Skema dan model Item untuk CRUD
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

// CREATE - Menambah Item
app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).send(newItem);
    } catch (error) {
        res.status(500).send({ message: 'Failed to create item', error: error.message });
    }
});

// READ - Mendapatkan Semua Item
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch items', error: error.message });
    }
});

// UPDATE - Memperbarui Item Berdasarkan ID
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).send({ message: 'Item not found' });
        }
        res.send(updatedItem);
    } catch (error) {
        res.status(500).send({ message: 'Failed to update item', error: error.message });
    }
});

// DELETE - Menghapus Item Berdasarkan ID
app.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send({ message: 'Item not found' });
        }
        res.status(204).send(); // Sukses menghapus
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete item', error: error.message });
    }
});

// Menjalankan server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
