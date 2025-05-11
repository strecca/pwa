#!/bin/bash

# Exit on any error
set -e

# Branch to push changes to
BRANCH="main"  # Change this if you're using a different branch

# Ensure you're in the correct directory (current working directory assumed)
echo "Working in directory: $(pwd)"

# Create or update files
echo "Creating/updating files..."

# Ensure necessary directories exist
mkdir -p backend/models
mkdir -p backend/routes
mkdir -p frontend/src

# Update backend/models/Form.js
cat > backend/models/Form.js << 'EOF'
const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: String,
  fields: Array, // Array of form fields
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Form', FormSchema);
EOF

# Update backend/models/User.js
cat > backend/models/User.js << 'EOF'
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
  roles: [String], // e.g., ['admin', 'user']
  permissions: [String], // e.g., ['create-form', 'submit-form']
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
EOF

# Update backend/routes/admin.js
cat > backend/routes/admin.js << 'EOF'
const express = require('express');
const Form = require('../models/Form');
const nano = require('nano');

const router = express.Router();
const couch = nano(process.env.COUCHDB_URL);
const formsDB = couch.db.use('forms'); // CouchDB database for forms

// Create a new form
router.post('/create-form', async (req, res) => {
  try {
    const form = await Form.create(req.body);

    // Sync with CouchDB
    const couchDoc = {
      _id: form._id.toString(),
      title: form.title,
      fields: form.fields,
      createdAt: form.createdAt,
    };
    await formsDB.insert(couchDoc);

    res.status(201).json({ message: 'Form created successfully', form });
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

module.exports = router;
EOF

# Update backend/routes/user.js
cat > backend/routes/user.js << 'EOF'
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
EOF

# Update backend/routes/sync.js
cat > backend/routes/sync.js << 'EOF'
const express = require('express');
const Form = require('../models/Form');
const nano = require('nano');

const router = express.Router();
const couch = nano(process.env.COUCHDB_URL);
const formsDB = couch.db.use('forms');

// Sync CouchDB to MongoDB
router.get('/couch-to-mongo', async (req, res) => {
  try {
    const { rows } = await formsDB.list({ include_docs: true });
    for (const row of rows) {
      const doc = row.doc;
      await Form.updateOne(
        { _id: doc._id },
        { title: doc.title, fields: doc.fields, createdAt: doc.createdAt },
        { upsert: true }
      );
    }
    res.status(200).json({ message: 'Synced CouchDB to MongoDB' });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

module.exports = router;
EOF

# Update frontend/src/pouchdb-sync.js
cat > frontend/src/pouchdb-sync.js << 'EOF'
import PouchDB from 'pouchdb-browser';

const formsDB = new PouchDB('forms');
const remoteFormsDB = new PouchDB('http://admin:youradminpassword@localhost:5984/forms');

// Sync forms between PouchDB and CouchDB
formsDB.sync(remoteFormsDB, {
  live: true,
  retry: true,
}).on('change', info => {
  console.log('Sync change:', info);
}).on('error', err => {
  console.error('Sync error:', err);
});

export default formsDB;
EOF

# Update frontend/src/fetch-forms.js
cat > frontend/src/fetch-forms.js << 'EOF'
import formsDB from './pouchdb-sync';

export async function fetchForms() {
  try {
    const allForms = await formsDB.allDocs({ include_docs: true });
    return allForms.rows.map(row => row.doc);
  } catch (err) {
    console.error('Error fetching forms:', err);
    throw err;
  }
}
EOF

# Update frontend/src/submit-form.js
cat > frontend/src/submit-form.js << 'EOF'
import PouchDB from 'pouchdb-browser';

const submissionsDB = new PouchDB('submissions');
const remoteSubmissionsDB = new PouchDB('http://admin:youradminpassword@localhost:5984/submissions');

// Sync submissions between PouchDB and CouchDB
submissionsDB.sync(remoteSubmissionsDB, {
  live: true,
  retry: true,
}).on('change', info => {
  console.log('Sync change:', info);
}).on('error', err => {
  console.error('Sync error:', err);
});

export async function submitForm(formId, formData) {
  try {
    const submission = {
      _id: new Date().toISOString(),
      formId,
      formData,
      submittedAt: new Date(),
    };

    await submissionsDB.put(submission);
    console.log('Form submission saved locally');
  } catch (err) {
    console.error('Error submitting form:', err);
    throw err;
  }
}
EOF

# Stage all the files
echo "Staging files..."
git add backend/models/Form.js
git add backend/models/User.js
git add backend/routes/admin.js
git add backend/routes/user.js
git add backend/routes/sync.js
git add frontend/src/pouchdb-sync.js
git add frontend/src/fetch-forms.js
git add frontend/src/submit-form.js

# Commit the changes
echo "Committing changes..."
git commit -m "Update all required app files with code changes"

# Push the changes to the remote repository
echo "Pushing changes to repository..."
git push origin "$BRANCH"

echo "All changes pushed successfully!"