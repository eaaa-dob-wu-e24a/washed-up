import AuthScreen from "@/components/auth/auth-screen";
import HomeScreen from "@/components/home/home-screen";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { View } from "react-native";

export default function Page() {
  return (
    <View>
      <SignedIn>
        <HomeScreen />
      </SignedIn>

      <SignedOut>
        <AuthScreen />
      </SignedOut>
    </View>
  );
}
