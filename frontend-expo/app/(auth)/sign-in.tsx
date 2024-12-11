import { AuthApi } from "~/api/auth";
import { Label } from "~/components/ui/label";
import { Link, router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth";

export default function Page() {
  const { setToken } = useAuth();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const authApi = React.useMemo(() => new AuthApi(), []);

  const onSignInPress = React.useCallback(async () => {
    try {
      const response = await authApi.signIn({
        email: emailAddress,
        password,
      });

      await setToken(response.token);
      router.replace("/");
    } catch (err: any) {
      console.error("Sign in error:", err.message);
    }
  }, [emailAddress, password, setToken, authApi]);

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
