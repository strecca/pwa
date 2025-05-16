const express = require('express');
const router = express.Router();
const Form = require('../models/Form'); // Form model for MongoDB

// Submit Form Route
router.post('/submit', async (req, res) => {
  const formData = req.body;

  try {
    const form = new Form(formData);
    await form.save();
    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (err) {
    console.error('Form submission error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Analytics Route
router.get('/analytics', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    console.error('Analytics fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;