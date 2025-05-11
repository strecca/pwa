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
