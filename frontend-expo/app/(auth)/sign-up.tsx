import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Api } from "api";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";

export default function SignUpScreen() {
  const api = new Api();

  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [metaData, setMetaData] = useState<{
    [key: string]: any;
  }>({});

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const validate = await api.validateCredentials({
        name,
        email: emailAddress,
        password,
        confirm_password: confirmPassword,
        location,
      });

      console.log(validate);
      if (!validate?.success) return;

      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        const db_sign_up = await api.signUp({
          name,
          email: emailAddress,
          password,
          location,
        });

        if (!db_sign_up?.access_token) return;

        setMetaData({
          access_token: db_sign_up.access_token,
          location: location,
          name: name,
        });

        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  useEffect(() => {
    async function updateMetadata() {
      if (!user) return;
      if (!metaData?.access_token) return;
      await api.updateClerkMetadata({
        access_token: metaData?.access_token,
        metadata: metaData,
        user_id: user.id,
      });

      await user.reload();
    }

    updateMetadata();
  }, [user]);

  return (
    <SafeAreaView className="flex flex-1 justify-between p-6">
      {!pendingVerification && (
        <>
          <View>
            <Heading
              title="Sign Up"
              subtitle="Get Washed Up by creating an account"
            />

            <View className="flex gap-4">
              <View>
                <Label className="mb-1">Name</Label>
                <Input
                  value={name}
                  placeholder="Name..."
                  onChangeText={(name) => setName(name)}
                />
              </View>

              <View>
                <Label className="mb-1">Email</Label>
                <Input
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Email..."
                  onChangeText={(email) => setEmailAddress(email)}
                />
              </View>

              <View>
                <Label className="mb-1">Password</Label>
                <Input
                  value={password}
                  placeholder="Password..."
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
              </View>

              <View>
                <Label className="mb-1">Confirm Password</Label>
                <Input
                  value={confirmPassword}
                  placeholder="Confirm Password..."
                  secureTextEntry={true}
                  onChangeText={(password) => setConfirmPassword(password)}
                />
              </View>
            </View>
          </View>

          <Button size={"high"} onPress={onSignUpPress}>
            <Text>Next step</Text>
          </Button>
        </>
      )}

      {pendingVerification && (
        <>
          <Input
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button size={"high"} onPress={onPressVerify}>
            <Text>Verify</Text>
          </Button>
        </>
      )}
    </SafeAreaView>
  );
}
