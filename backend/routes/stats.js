const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// GET /api/stats -> powers the "Lives Saved / Blood Units Donated / Active Donors / Partner Hospitals" numbers
router.get('/', async (req, res) => {
  try {
    const activeDonors = await Donor.countDocuments({ role: 'donor' });
    const livesSaved = await Donor.countDocuments({ role: 'donor', hasDonated: true });
    // bloodUnitsDonated and partnerHospitals aren't modeled yet — placeholders until
    // you add a Donation/Hospital collection. Safe to hardcode or extend later.
    const bloodUnitsDonated = livesSaved; // 1 donation ~= 1 unit, adjust as needed
    const partnerHospitals = 0;

    res.json({
      livesSaved,
      bloodUnitsDonated,
      activeDonors,
      partnerHospitals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load stats.' });
  }
});

module.exports = router;
