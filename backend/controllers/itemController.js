const { default: mongoose } = require('mongoose');
const Item = require('../models/itemModel');
const Joi = require('joi');

const itemSchemaJoi = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(500).required()
});

exports.createItem = async (req, res) => {
    const { error } = itemSchemaJoi.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create item', error: err.message });
    }
};

exports.getItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const items = await Item.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const totalItems = await Item.countDocuments();

        res.status(200).json({
            page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            data: items
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch items', error: err.message });
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const { error } = itemSchemaJoi.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const item = await Item.findByIdAndUpdate(id, req.body, { new: true });
        if (!item){
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update item', error: err.message })
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID'});
    }

    try {
        const item = await Item.findByIdAndDelete(id);
        if(!item) {
            return res.status(400).json({ message: 'Item not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Failed to delete item", error: err.message });
    }
};