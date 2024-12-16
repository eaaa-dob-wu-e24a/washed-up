import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import * as Notifications from "expo-notifications";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as TaskManager from "expo-task-manager";
import "global.css";
import { useEffect, useState } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StripeProvider from "~/components/stripe-provider";
import { AuthProvider } from "~/context/auth";
import { NotificationProvider } from "~/context/notification-context";
import { NAV_THEME } from "~/lib/constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

SplashScreen.preventAutoHideAsync();

// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       const item = await SecureStore.getItemAsync(key);
//       if (item) {
//         console.log(`${key} was used 🔐 \n`);
//       } else {
//         console.log("No values stored under key: " + key);
//       }
//       return item;
//     } catch (error) {
//       console.error("SecureStore get item error: ", error);
//       await SecureStore.deleteItemAsync(key);
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

SplashScreen.preventAutoHideAsync();

export default function RootLayoutNav() {
  // Opsætning af app tema, som henter native colorScheme fra enheden
  const nativeColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<Theme>(LIGHT_THEME);

  useEffect(() => {
    setColorScheme(nativeColorScheme === "dark" ? DARK_THEME : LIGHT_THEME);
  }, []);

  useEffect(() => {
    setColorScheme(nativeColorScheme === "dark" ? DARK_THEME : LIGHT_THEME);
  }, [nativeColorScheme]);

  // Opsætning af fonte
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // Returnerer app layout, som indeholder alle context providers
  return (
    <AuthProvider>
      <NotificationProvider>
        <StripeProvider>
          <ThemeProvider value={colorScheme}>
            <StatusBar />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="index" />
              </Stack>
              <PortalHost />
            </GestureHandlerRootView>
          </ThemeProvider>
        </StripeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
