import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router/stack";
import { Pressable, Text } from "react-native";

export default function Layout() {
  const { signOut } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerRight: () => {
          return (
            <Pressable onPress={() => signOut()}>
              <Text>Sign out</Text>
            </Pressable>
          );
        },
      }}
    />
  );
}
