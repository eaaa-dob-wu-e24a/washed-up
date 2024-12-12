import { useAuth } from "~/context/auth";
import { Redirect, Tabs } from "expo-router";
import {
  LucideWashingMachine,
  ScanQrCode,
  User,
  WashingMachine,
  WashingMachineIcon,
} from "lucide-react-native";
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: "#a0a0a0",
        tabBarActiveTintColor: "#479e96",
        ...(Platform.OS === "android" && {
          tabBarStyle: {
            height: 60,
            paddingTop: 4,
          },
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              activeOpacity={1}
            />
          ),
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <WashingMachine color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-page"
        options={{
          title: "My Page",
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
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
