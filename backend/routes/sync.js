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
