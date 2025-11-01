const express = require('express');
const axios = require('axios');
const Papa = require('papaparse');
const Sales = require('../models/Sales');
const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/data', authMiddleware, async (req, res) => {
  try {
    const { dataLink, dataType } = req.body;

    if (!dataLink) {
      return res.status(400).json({ message: 'Data link is required' });
    }

    const response = await axios.get(dataLink);
    const csvData = response.data;

    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          if (dataType === 'sales') {
            await Sales.insertMany(results.data);
          } else if (dataType === 'inventory') {
            await Inventory.insertMany(results.data);
          } else if (dataType === 'expenses') {
            await Expense.insertMany(results.data);
          }

          await Admin.findByIdAndUpdate(req.admin.id, { lastUpdated: new Date() });

          res.json({ message: `${dataType} data imported successfully`, count: results.data.length });
        } catch (error) {
          res.status(500).json({ message: 'Failed to import data', error: error.message });
        }
      },
      error: (error) => {
        res.status(500).json({ message: 'Failed to parse CSV', error: error.message });
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to import data', error: error.message });
  }
});

router.post('/link', authMiddleware, async (req, res) => {
  try {
    const { dataLink } = req.body;
    await Admin.findByIdAndUpdate(req.admin.id, { dataLink });
    res.json({ message: 'Data link updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update data link', error: error.message });
  }
});

module.exports = router;