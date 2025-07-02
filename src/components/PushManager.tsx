// src/components/PushManager.tsx
import { useEffect } from "react";
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

const vapidKey = "BOyh_f-Oiv-PovpPqgy6P5cvEfnznVhx1_zrf5ReDHnE8dMMzIH_LmMrgwvM4ZOAcDePwAQ7hPafRH66fwziR8A";

export function PushManager() {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey }).then((currentToken) => {
          if (currentToken) {
            console.log("📲 FCM Token:", currentToken);
            // OPTIONAL: You can send this token to your backend or save in localStorage
          } else {
            console.warn("No registration token available.");
          }
        }).catch((err) => {
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
