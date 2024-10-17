const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authenticationToken = require('../middlewares/authMiddleware');

router.post('/', authenticationToken, itemController.createItem);
router.get('/', authenticationToken, itemController.getItems);
router.put('/:id', authenticationToken, itemController.updateItem);
router.delete('/:id', authenticationToken, itemController.deleteItem);

module.exports = router;