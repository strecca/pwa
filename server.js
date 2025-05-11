const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const syncRoutes = require('./routes/sync');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/sync', syncRoutes);

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/formsdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
