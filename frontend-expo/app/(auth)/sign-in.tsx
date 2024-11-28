import { useSignIn } from "@clerk/clerk-expo";
import { Label } from "~/components/ui/label";
import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
        });

        // router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      <View className="gap-4">
        <Heading
          title="Login to your account"
          subtitle="Start getting washed up!"
        />
        <View>
          <Label className="mb-2">Email</Label>
          <Input
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>
        <View>
          <Label className="mb-2">Password</Label>
          <Input
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View className="pt-6">
          <Button size="high" onPress={onSignInPress}>
            <Text>Sign In</Text>
          </Button>
        </View>
      </View>
      <View className="gap-4">
        <View className="flex flex-row items-center">
          <View className="flex-1 h-px bg-gray-300"></View>
          <Text className="px-3 text-center">Don't have an account?</Text>
          <View className="flex-1 h-px bg-gray-300"></View>
        </View>
        <View>
          <Link href={"/sign-up"} className="p-8" asChild>
            <Button variant={"outline"}>
              <Text>Create an account</Text>
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
