import { Link } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Welcome() {
  return (
    <SafeAreaView className="flex flex-1 justify-end">
      <View className="flex gap-3 p-6">
        <Link href="/sign-in" asChild>
          <Button>
            <Text>Sign In</Text>
          </Button>
        </Link>
        <Link href={"/sign-up"} asChild>
          <Button variant={"outline"}>
            <Text>Sign Up</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
