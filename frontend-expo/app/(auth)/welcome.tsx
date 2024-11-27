import { Image } from "expo-image";
import { Link } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Welcome() {
  return (
    <SafeAreaView className="flex flex-1 justify-center">
      <Image
        source={require("../../assets/images/washed-up-logo.svg")}
        className="flex items-center h-96"
        contentFit="fill"
        transition={1000}
      />
      <View className="flex items-center">
        <Text className="text-xl">The easiest way to get washed up!</Text>
      </View>
      <View className="flex gap-3 p-6">
        <Link href={"/sign-up"} className="p-8" asChild>
          <Button>
            <Text>Create an account</Text>
          </Button>
        </Link>
        <View className="flex flex-row items-center">
          <View className="flex-1 h-px bg-gray-300"></View>
          <Text className="px-3 text-center">or</Text>
          <View className="flex-1 h-px bg-gray-300"></View>
        </View>
        <Link href={"/sign-in"} className="p-8" asChild>
          <Button variant={"outline"}>
            <Text>Login to an existing account</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
