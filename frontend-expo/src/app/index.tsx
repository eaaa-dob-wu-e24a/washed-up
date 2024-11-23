import AuthScreen from "components/auth/auth-screen";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView>
      <View>
        <SignedIn>
          <Link href={"/dashboard"} replace>
            Welcome! Click here to go to the dashboard.
          </Link>
        </SignedIn>

        <SignedOut>
          <AuthScreen />
        </SignedOut>
      </View>
    </SafeAreaView>
  );
}
