import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
          title: "Schedule Details",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
