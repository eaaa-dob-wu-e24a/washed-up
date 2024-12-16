import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "~/utils/registerForPushNotificationsAsync";
import { useAuth } from "~/context/auth";
import { Api } from "~/api";

// Define the shape of our notification context state
interface NotificationContextType {
  expoPushToken: string | null; // Token for push notifications
  notification: Notifications.Notification | null; // Current notification
  error: Error | null; // Any errors that occur
}

// Create the context with undefined default value
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Props interface for the NotificationProvider
interface NotificationProviderProps {
  children: ReactNode;
}

// NotificationProvider component that manages push notification state and subscriptions
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  // Get authentication state
  const { token, isSignedIn } = useAuth();
  const api = new Api(token);

  // State management for notifications
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Refs to store notification listeners for cleanup
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Only proceed if user is signed in and has a token
    if (!isSignedIn || !token) return;

    // Register for push notifications and handle token registration with server
    registerForPushNotificationsAsync().then(
      async (token) => {
        if (token) {
          setExpoPushToken(token);
          try {
            const success = await api.registerToken(token);
            if (!success) {
              throw new Error("Failed to register token with server");
            }
          } catch (error) {
            console.error("Failed to register token with server:", error);
          }
        }
      },
      (error) => setError(error)
    );

    // Set up listener for receiving notifications while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Set up listener for user interaction with notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
      });

    // Cleanup function to remove notification listeners
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [token, isSignedIn]); // Re-run effect when auth token or sign-in status changes

  // Provide notification context to children components
  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
