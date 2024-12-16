import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/context/auth";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  // Hvis brugeren er logget ind, sendes de til forsiden
  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
