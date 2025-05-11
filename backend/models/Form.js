const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: String,
  fields: Array, // Array of form fields
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Form', FormSchema);
