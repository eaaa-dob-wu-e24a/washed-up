import { Link } from "expo-router";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export default function AuthScreen() {
  return (
    <View className="flex gap-3 px-6">
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
  );
}
