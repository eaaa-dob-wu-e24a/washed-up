import { useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";

export default function Layout() {
  const { user } = useUser();

  if (!user) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="my-page" />
      <Tabs.Screen name="qr" />
    </Tabs>
  );
}
