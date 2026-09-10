const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');

// POST /api/requests -> submit a "Looking for Blood" request
router.post('/', async (req, res) => {
  try {
    const { name, phone, bloodGroupNeeded, location, urgency, notes } = req.body;

    if (!name || !phone || !bloodGroupNeeded || !location) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const request = await BloodRequest.create({
      name,
      phone,
      bloodGroupNeeded,
      location,
      urgency,
      notes,
    });

    res.status(201).json({ message: 'Your request has been posted.', request });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/requests -> list all open requests (for an admin/hospital view later)
router.get('/', async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json({ count: requests.length, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load requests.' });
  }
});

module.exports = router;
