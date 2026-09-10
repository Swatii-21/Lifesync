require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const donorRoutes = require('./routes/donors');
const subscribeRoutes = require('./routes/subscribe');
const storyRoutes = require('./routes/stories');
const statsRoutes = require('./routes/stats');
const appointmentRoutes = require('./routes/appointments');
const requestRoutes = require('./routes/requests');
const bloodDriveRoutes = require('./routes/blooddrives');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/donors', donorRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/blooddrives', bloodDriveRoutes);

app.get('/', (req, res) => {
  res.send('BloodSync API is running.');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bloodsync';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });