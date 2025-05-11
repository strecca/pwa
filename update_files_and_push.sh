#!/bin/bash

# Exit on any error
set -e

# Branch to push changes to
BRANCH="main"  # Change this if you're using a different branch

# Ensure you're in the correct directory (current working directory assumed)
echo "Working in directory: $(pwd)"

# Create or update files
echo "Creating/updating files..."

# Update frontend/public/service-worker.js
mkdir -p frontend/public
cat > frontend/public/service-worker.js << 'EOF'
self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push Received:', data);

  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/badge.png',
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // Navigate to the app's home page
  );
});
EOF

# Update frontend/src/index.js
mkdir -p frontend/src
cat > frontend/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(`${process.env.PUBLIC_URL}/service-worker.js`)
    .then(registration => {
      console.log('Service Worker registered:', registration);

      // Subscribe to push notifications
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
        })
        .then(subscription => {
          console.log('Push Notification Subscription:', subscription);

          // Send subscription to backend
          fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
          });
        })
        .catch(error => console.error('Push subscription error:', error));
    })
    .catch(error => console.error('Service Worker registration error:', error));
}

ReactDOM.render(<App />, document.getElementById('root'));
EOF

# Update frontend/.env
cat > frontend/.env << 'EOF'
# VAPID Public Key for Push Notifications
REACT_APP_VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
EOF

# Update backend/routes/notifications.js
mkdir -p backend/routes
cat > backend/routes/notifications.js << 'EOF'
const express = require('express');
const router = express.Router();
const webPush = require('../utils/webPush');

// In-memory storage for subscriptions (use a database in production)
let subscriptions = [];

// Route to save a subscription
router.post('/subscribe', (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }

  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription saved successfully' });
});

// Route to send a push notification
router.post('/send', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  const payload = JSON.stringify({ title, body });

  try {
    await Promise.all(
      subscriptions.map(subscription =>
        webPush.sendNotification(subscription, payload)
      )
    );
    res.status(200).json({ message: 'Push notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Error sending notifications' });
  }
});

module.exports = router;
EOF

# Update backend/utils/webPush.js
mkdir -p backend/utils
cat > backend/utils/webPush.js << 'EOF'
const webPush = require('web-push');

// Configure VAPID keys (replace with your own keys)
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.error(
    'VAPID keys are missing. Please set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in the .env file.'
  );
  process.exit(1);
}

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidPublicKey,
  vapidPrivateKey
);

module.exports = webPush;
EOF

# Update backend/.env
cat > backend/.env << 'EOF'
# VAPID keys for Web Push notifications
VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
EOF

# Update backend/package.json
cat > backend/package.json << 'EOF'
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Backend server for handling push notifications",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "web-push": "^3.5.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOF

# Update backend/server.js
cat > backend/server.js << 'EOF'
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
EOF

# Git operations
echo "Staging changes..."
git add .

echo "Committing changes..."
git commit -m "Update frontend and backend for push notifications"

echo "Pushing changes to repository..."
git push origin "$BRANCH"

echo "All changes pushed successfully!"