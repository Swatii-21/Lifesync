const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true }, // e.g. "Life Saved - December 2024"
    bloodType: { type: String, trim: true }, // e.g. "A+", "All+", "🏥"
    content: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }], // e.g. ["4 Units Received", "2 Hours", "AIIMS Delhi"]
    approved: { type: Boolean, default: false }, // admin moderation before it shows publicly
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
