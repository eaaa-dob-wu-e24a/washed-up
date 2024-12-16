import { Redirect, Tabs } from "expo-router";
import { ScanQrCode, User, WashingMachine } from "lucide-react-native";
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useAuth } from "~/context/auth";

// Layout component for the dashboard tab navigation
export default function Layout() {
  // Get authentication state from context
  const { isSignedIn } = useAuth();

  // Redirect to home if user is not signed in
  if (!isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header for all tab screens
        tabBarInactiveTintColor: "#a0a0a0", // Gray color for inactive tabs
        tabBarActiveTintColor: "#479e96", // Teal color for active tab
        // Android-specific tab bar customization
        ...(Platform.OS === "android" && {
          tabBarStyle: {
            height: 60,
            paddingTop: 4,
          },
          // Custom touch handler for Android tabs
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              activeOpacity={1}
            />
          ),
        }),
      }}
    >
      {/* Dashboard tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <WashingMachine color={color} />,
        }}
      />
      {/* User profile tab */}
      <Tabs.Screen
        name="my-page"
        options={{
          title: "My Page",
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
      {/* QR code scanner tab */}
      <Tabs.Screen
        name="qr"
        options={{
          title: "Scan QR",
          tabBarIcon: ({ color }) => <ScanQrCode color={color} />,
        }}
      />
    </Tabs>
  );
}
