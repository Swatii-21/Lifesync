const mongoose = require('mongoose');

const bloodDriveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // e.g. "College Blood Drive"
    organizer: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true }, // city/area, used for search
    address: { type: String, required: true, trim: true }, // full address
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "10:00 AM"
    endTime: { type: String, required: true }, // e.g. "4:00 PM"
    contactPhone: { type: String, required: true, match: /^\d{10}$/ },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

bloodDriveSchema.index({ location: 1, date: 1 });

module.exports = mongoose.model('BloodDrive', bloodDriveSchema);
