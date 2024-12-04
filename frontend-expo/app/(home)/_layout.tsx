import { useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { ScanQrCode, User, WashingMachine } from "lucide-react-native";
import { Platform } from "react-native";

export default function Layout() {
  const { user } = useUser();

  if (!user) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#479e96",
        ...(Platform.OS === "android" && {
          tabBarStyle: {
            height: 60,
            paddingTop: 4,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="dashboard"
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
