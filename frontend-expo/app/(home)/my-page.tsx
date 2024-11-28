import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function MyPage() {
  const { signOut } = useAuth();
  const { user } = useUser();

  if (!user) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      <View>
        <Text>My Page</Text>
        <Button onPress={() => signOut()}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
