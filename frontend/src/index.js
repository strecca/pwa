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
