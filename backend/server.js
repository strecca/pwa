const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const notificationsRoutes = require('./routes/notifications');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/notifications', notificationsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
