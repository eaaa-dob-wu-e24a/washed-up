import { Stack } from "expo-router";

// Layout til modals på dashboardet
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="booking-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="schedule-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="pay-modal"
        options={{
          presentation: "modal",
          title: "Buy Credits",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
