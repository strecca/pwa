const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
  roles: [String], // e.g., ['admin', 'user']
  permissions: [String], // e.g., ['create-form', 'submit-form']
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
