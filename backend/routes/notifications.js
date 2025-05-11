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
