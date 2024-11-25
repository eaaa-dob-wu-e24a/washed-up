import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Api } from "api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

export default function SignUpScreen() {
  const api = new Api();

  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
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
        location,
      });

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
    <SafeAreaView className="flex flex-1">
      {!pendingVerification && (
        <>
          <Heading
            title="Sign Up"
            subtitle="Get Washed Up by creating an account"
          />
          <Input
            value={name}
            placeholder="Name..."
            onChangeText={(name) => setName(name)}
          />
          <Input
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
          />
          <Input
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Input
            value={location}
            placeholder="Location..."
            onChangeText={(location) => setLocation(location)}
          />

          <Button onPress={onSignUpPress}>
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
          <Button onPress={onPressVerify}>
            <Text>Verify</Text>
          </Button>
        </>
      )}
    </SafeAreaView>
  );
}
