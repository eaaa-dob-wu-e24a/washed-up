import { useEffect, useState } from "react";
import { TextInput, Button, View } from "react-native";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { signUp as dbSignUp, updateClerkMetadata } from "@/queries";

export default function SignUpScreen() {
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
      const db_sign_up = await dbSignUp({
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
    if (!user) return;

    async function updateMetadata() {
      if (!metaData?.access_token) return;
      await updateClerkMetadata({
        access_token: metaData?.access_token,
        metadata: metaData,
        user_id: user.id,
      });
    }

    updateMetadata();
  }, [user]);

  return (
    <View>
      {!pendingVerification && (
        <>
          <TextInput
            value={name}
            placeholder="Name..."
            onChangeText={(name) => setName(name)}
          />
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <TextInput
            value={location}
            placeholder="Location..."
            onChangeText={(location) => setLocation(location)}
          />

          <Button title="Sign Up" onPress={onSignUpPress} />
        </>
      )}

      {pendingVerification && (
        <>
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
    </View>
  );
}
