// src/components/PushManager.tsx
import { useEffect } from "react";
import { messaging, db } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

const vapidKey = "BOyh_f-Oiv-PovpPqgy6P5cvEfnznVhx1_zrf5ReDHnE8dMMzIH_LmMrgwvM4ZOAcDePwAQ7hPafRH66fwziR8A";

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  return "desktop";
}

async function saveTokenToFirestore(token: string) {
  const deviceType = getDeviceType();
  const deviceId = `${deviceType}_${token.slice(-6)}`; // Unique ID

  await setDoc(doc(db, "fcmTokens", deviceId), {
    token,
    deviceType,
    userAgent: navigator.userAgent,
    savedAt: new Date(),
  });
}

export function PushManager() {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey })
          .then((currentToken) => {
            if (currentToken) {
              console.log("📲 FCM Token:", currentToken);
              saveTokenToFirestore(currentToken); // ✅ Save to Firestore
            } else {
              console.warn("No registration token available.");
            }
          })
          .catch((err) => {
            console.error("An error occurred while retrieving token.", err);
          });
      }
    });

    onMessage(messaging, (payload) => {
      console.log("🔔 Foreground message received:", payload);
      if (
        payload.notification &&
        typeof payload.notification.title === "string" &&
        typeof payload.notification.body === "string"
      ) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/vite.svg",
        });
      } else {
        console.warn("Notification payload is missing required fields.", payload);
      }
    });
  }, []);

  return null;
}
