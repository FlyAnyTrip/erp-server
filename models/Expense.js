const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ['Utilities', 'Salaries', 'Rent', 'Supplies', 'Marketing', 'Other'],
    required: true,
  },
  description: String,
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);