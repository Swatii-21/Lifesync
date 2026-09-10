const express = require('express');
const router = express.Router();
const BloodDrive = require('../models/BloodDrive');

// GET /api/blooddrives?location= -> list upcoming drives, optionally filtered by location
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    const filter = { date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }; // only upcoming/today

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const drives = await BloodDrive.find(filter).sort({ date: 1 });
    res.json({ count: drives.length, drives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load blood drives.' });
  }
});

// POST /api/blooddrives -> organize/add a new blood drive
router.post('/', async (req, res) => {
  try {
    const { title, organizer, location, address, date, startTime, endTime, contactPhone, notes } = req.body;

    if (!title || !organizer || !location || !address || !date || !startTime || !endTime || !contactPhone) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const drive = await BloodDrive.create({
      title,
      organizer,
      location,
      address,
      date,
      startTime,
      endTime,
      contactPhone,
      notes,
    });

    res.status(201).json({ message: 'Blood drive added successfully!', drive });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
