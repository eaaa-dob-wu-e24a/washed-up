import AuthScreen from "components/auth/auth-screen";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { Button } from "~/components/ui/button";

export default function Page() {
  const { user } = useUser();

  if (!user) {
    return (
      <SafeAreaView className="flex flex-1 justify-end">
        <AuthScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Link className="text-red-600" href={"/dashboard"} replace>
        Welcome! Click here to go to the dashboard.
      </Link>
    </SafeAreaView>
  );
}
