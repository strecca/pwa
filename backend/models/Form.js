const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID of the user who submitted the form
  data: { type: Object, required: true }, // Form data
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Form', FormSchema);