importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyDM6MN__48RJX7qEogIHLKB0pl9sDR1840",
  authDomain: "mypwaapp-b385b.firebaseapp.com",
  projectId: "mypwaapp-b385b",
  storageBucket: "mypwaapp-b385b.firebasestorage.app",
  messagingSenderId: "388926845795",
  appId: "1:388926845795:web:e9c63694d1af802897d956"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vite.svg", // optional icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
