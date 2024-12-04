import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "modal", // Ensures modal presentation style
        headerShown: true,
        title: "Schedule Modal",
      }}
    />
  );
}
