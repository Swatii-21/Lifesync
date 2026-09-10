const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// POST /api/donors  -> register (the donationForm on the homepage)
router.post('/', async (req, res) => {
  try {
    const { name, gender, bloodGroup, location, role, phone, email } = req.body;

    if (!name || !gender || !bloodGroup || !location || !role || !phone || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const donor = await Donor.create({
      name,
      gender,
      bloodGroup,
      location,
      role,
      phone,
      email,
    });

    res.status(201).json({ message: 'Registered successfully!', donor });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/donors/search?q=&bloodGroup=&location=&role=
// Powers the "Search acceptor, donors, hospitals, etc." box
router.get('/search', async (req, res) => {
  try {
    const { q, bloodGroup, location, role } = req.query;
    const filter = {};

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (role) filter.role = role;
    if (location) filter.location = { $regex: location, $options: 'i' };

    // Free-text query "q" checks name, location, and blood group together
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { bloodGroup: { $regex: q, $options: 'i' } },
      ];
    }

    const results = await Donor.find(filter)
      .select('-__v') // hide internal fields; phone/email still returned for matched contacts
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed. Please try again.' });
  }
});

// GET /api/donors/compatible/:bloodGroup -> who can donate TO this blood group
// Uses the compatibility rules from the About section's blood chart
const COMPATIBLE_DONORS = {
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
};

router.get('/compatible/:bloodGroup', async (req, res) => {
  try {
    const recipientGroup = req.params.bloodGroup.toUpperCase();
    const compatibleGroups = COMPATIBLE_DONORS[recipientGroup];
    const { location } = req.query;

    if (!compatibleGroups) {
      return res.status(400).json({ message: 'Invalid blood group.' });
    }

    const filter = {
      role: 'donor',
      bloodGroup: { $in: compatibleGroups },
    };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const donors = await Donor.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({ recipientGroup, compatibleGroups, count: donors.length, donors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;