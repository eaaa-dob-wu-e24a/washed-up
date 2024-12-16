import { Stack } from "expo-router";

// Layout component for the schedule modal screen
// Handles the navigation stack for schedule details view
const Layout = () => {
  return (
    // Stack navigator container for modal screens
    <Stack>
      {/* Dynamic route screen using [id] parameter */}
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal", // Display as modal overlay
          title: "Schedule Details", // Modal header title
          headerShown: false, // Hide the default header
        }}
      />
    </Stack>
  );
};

export default Layout;
