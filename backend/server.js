const mongoose = require('mongoose');
const nano = require('nano');
require('dotenv').config(); // Load environment variables

// Fix Mongoose strictQuery warning
mongoose.set('strictQuery', true);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// CouchDB Connection
const couch = nano(process.env.COUCHDB_URL);
console.log('CouchDB URL:', process.env.COUCHDB_URL); // Debugging CouchDB URL

// Check if database exists and connect or create it
couch.db.get('form-app')
  .then(() => console.log('Connected to CouchDB database: form-app'))
  .catch(err => {
    if (err.statusCode === 404) {
      // Database doesn't exist, so create it
      couch.db.create('form-app')
        .then(() => console.log('Database created: form-app'))
        .catch(createErr => console.error('Error creating database:', createErr));
    } else {
      // Other errors
      console.error('Error connecting to CouchDB:', err);
    }
  });