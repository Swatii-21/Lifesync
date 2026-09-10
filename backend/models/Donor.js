const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    location: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ['donor', 'acceptor'] },
    phone: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    // Set true once a donor has actually completed a donation (used for stats)
    hasDonated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helpful for search by blood group / location / role
donorSchema.index({ bloodGroup: 1, location: 1, role: 1 });

module.exports = mongoose.model('Donor', donorSchema);
