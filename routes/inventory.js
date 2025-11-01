const express = require('express');
const Inventory = require('../models/Inventory');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inventory', error: error.message });
  }
});

router.get('/low-stock', authMiddleware, async (req, res) => {
  try {
    const lowStock = await Inventory.find({ $expr: { $lte: ['$quantity', '$minStock'] } });
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch low stock items', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json({ message: 'Inventory item created', item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create inventory item', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Inventory item updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update inventory item', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete inventory item', error: error.message });
  }
});

module.exports = router;