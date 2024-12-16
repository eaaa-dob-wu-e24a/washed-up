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

// Skærm til login
export default function Page() {
  const { setToken } = useAuth();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const authApi = React.useMemo(() => new AuthApi(), []);

  // Funktion til at logge ind, kaldes når der trykkes på knappen
  const onSignInPress = React.useCallback(async () => {
    try {
      setError(""); // Clear previous errors
      const response = await authApi.signIn({
        email: emailAddress,
        password,
      });

      await setToken(response.token);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
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
            className="placeholder:text-foreground"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>
        <View>
          <Label className="mb-2">Password</Label>
          <Input
            value={password}
            placeholder="Password..."
            className="placeholder:text-foreground"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        {error && <Text className="text-destructive">{error}</Text>}
        <Button size="high" onPress={onSignInPress}>
          <Text>Sign In</Text>
        </Button>
      </View>
      <View className="gap-4">
        <View className="flex flex-row items-center">
          <View className="flex-1 h-px bg-secondary-foreground"></View>
          <Text className="px-3 text-center">Don't have an account?</Text>
          <View className="flex-1 h-px bg-secondary-foreground"></View>
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
