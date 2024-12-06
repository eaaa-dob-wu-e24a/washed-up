import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
          title: "Booking Details",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
