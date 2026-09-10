const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// GET /api/stories -> only approved stories (for the Success Stories section)
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ count: stories.length, stories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load stories.' });
  }
});

// POST /api/stories -> "Share Your Story" button submission
// Goes in unapproved until an admin approves it (see PATCH route below)
router.post('/', async (req, res) => {
  try {
    const { name, subtitle, bloodType, content, tags } = req.body;

    if (!name || !content) {
      return res.status(400).json({ message: 'Name and story content are required.' });
    }

    const story = await Story.create({ name, subtitle, bloodType, content, tags });
    res.status(201).json({
      message: 'Thank you for sharing! Your story will appear after review.',
      story,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// PATCH /api/stories/:id/approve -> simple admin moderation endpoint
router.patch('/:id/approve', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!story) return res.status(404).json({ message: 'Story not found.' });
    res.json({ message: 'Story approved.', story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;
