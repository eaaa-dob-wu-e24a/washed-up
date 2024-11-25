import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Stack } from "expo-router/stack";
import { Button } from "react-native";

export default function Layout() {
  const { signOut } = useAuth();
  const { user } = useUser();

  if (!user) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="my-page" />
      <Tabs.Screen name="my-qr" />
    </Tabs>
  );
}
