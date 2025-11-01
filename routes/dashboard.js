const express = require('express');
const Sales = require('../models/Sales');
const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalSales = await Sales.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const todaySales = await Sales.aggregate([
      { $match: { date: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const lowStockItems = await Inventory.find({ $expr: { $lte: ['$quantity', '$minStock'] } });

    const totalProfit = await Sales.aggregate([
      { $group: { _id: null, total: { $sum: '$profit' } } },
    ]);

    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      todaySales: todaySales[0]?.total || 0,
      totalProfit: totalProfit[0]?.total || 0,
      lowStockItems: lowStockItems.length,
      pendingTasks,
      completedTasks,
      lastUpdated: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

module.exports = router;