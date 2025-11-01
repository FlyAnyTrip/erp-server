const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  productName: String,
  quantity: Number,
  unitPrice: Number,
  totalAmount: Number,
  profit: Number,
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Cancelled'],
    default: 'Completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Sales', salesSchema);