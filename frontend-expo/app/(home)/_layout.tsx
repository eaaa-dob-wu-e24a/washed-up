import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { Button } from "react-native";

export default function Layout() {
  const { signOut } = useAuth();
  const { user } = useUser();

  if (!user) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerRight: () => {
          return <Button onPress={() => signOut()} title="Sign out" />;
        },
      }}
    />
  );
}
