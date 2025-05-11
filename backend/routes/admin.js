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
