const express = require('express');
const Sales = require('../models/Sales');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const sales = await Sales.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
  }
});

router.get('/range/:startDate/:endDate', authMiddleware, async (req, res) => {
  try {
    const sales = await Sales.find({
      date: {
        $gte: new Date(req.params.startDate),
        $lte: new Date(req.params.endDate),
      },
    }).sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productName, quantity, unitPrice, profit } = req.body;
    const totalAmount = quantity * unitPrice;

    const sale = new Sales({
      productName,
      quantity,
      unitPrice,
      totalAmount,
      profit,
    });

    await sale.save();
    res.status(201).json({ message: 'Sale created', sale });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create sale', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const sale = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Sale updated', sale });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update sale', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Sales.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sale', error: error.message });
  }
});

module.exports = router;