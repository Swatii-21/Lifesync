const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// POST /api/appointments -> book a new appointment
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, mode, location, preferredDate, preferredTime, notes } = req.body;

    if (!name || !email || !phone || !bloodGroup || !mode || !location || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      bloodGroup,
      mode,
      location,
      preferredDate,
      preferredTime,
      notes,
    });

    res.status(201).json({
      message: 'Appointment booked successfully! We will confirm it shortly.',
      appointment,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/appointments -> list all (for an admin view later)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ preferredDate: 1 });
    res.json({ count: appointments.length, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load appointments.' });
  }
});

// PATCH /api/appointments/:id -> update status (confirm/cancel) for admin use
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });

    res.json({ message: 'Appointment updated.', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;
