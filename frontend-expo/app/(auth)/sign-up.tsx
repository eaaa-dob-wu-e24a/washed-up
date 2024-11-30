import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Api } from "api";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Heading from "~/components/heading";
import InputError from "~/components/input-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { Location } from "~/types";

export default function SignUpScreen() {
  const api = new Api();

  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();

  const insets = useSafeAreaInsets();

  const [screen, setScreen] = useState<
    "userInfo" | "location" | "verification"
  >("userInfo");
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [code, setCode] = useState("");
  const [metaData, setMetaData] = useState<{
    [key: string]: any;
  }>({});
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 16,
    right: 16,
  };

  const onNextStep = async () => {
    if (screen === "userInfo") {
      const validate = await api.validateCredentials({
        name,
        email: emailAddress,
        password,
        confirm_password: confirmPassword,
      });

      if (validate?.success) {
        setScreen("location");
      } else {
        setErrors(validate);
      }
    } else if (screen === "location") {
      if (!isLoaded) return;
      if (location === "") {
        setErrors({ location: "Location is required" });
        return;
      }
      if (locationCode === "") {
        setErrors({ locationCode: "Location code is required" });
      }

      const selectedLocation = locations.find(
        (loc) => loc.id === parseInt(location)
      );

      if (selectedLocation?.code !== locationCode) {
        setErrors({ locationCode: "Invalid location code" });
        return;
      } else {
        try {
          await signUp.create({
            emailAddress,
            password,
          });
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setScreen("verification");
        } catch (err: any) {
          console.error(JSON.stringify(err, null, 2));
        }
      }
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    if (code === "") {
      setErrors({ code: "Verification code is required" });
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

        if (db_sign_up?.access_token) {
          setMetaData({
            access_token: db_sign_up.access_token,
            location: location,
            name: name,
          });
          await setActive({ session: completeSignUp.createdSessionId });
        }
      } else {
        setErrors({ code: "Invalid verification code" });
      }
    } catch (err: any) {
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

  useEffect(() => {
    async function getLocations() {
      await api.getLocations().then((data) => {
        setLocations(data);
      });
    }

    getLocations();
  }, []);

  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      {screen === "userInfo" && (
        <>
          <View className="gap-4">
            <Heading
              title="Create new account"
              subtitle="Start getting washed up!"
            />
            <View>
              <Label className="mb-2">Name</Label>
              <Input
                value={name}
                placeholder="Name..."
                onChangeText={setName}
              />
              <InputError errors={errors} name="name" />
            </View>
            <View>
              <Label className="mb-2">Email</Label>
              <Input
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email..."
                onChangeText={setEmailAddress}
              />
              <InputError errors={errors} name="email" />
            </View>
            <View>
              <Label className="mb-2">Password</Label>
              <Input
                value={password}
                placeholder="Password..."
                secureTextEntry={true}
                onChangeText={setPassword}
              />
              <InputError errors={errors} name="password" />
            </View>
            <View>
              <Label className="mb-2">Confirm Password</Label>
              <Input
                value={confirmPassword}
                placeholder="Confirm Password..."
                secureTextEntry={true}
                onChangeText={setConfirmPassword}
              />
              <InputError errors={errors} name="c_password" />
            </View>
          </View>
          <View>
            <Button size="high" onPress={onNextStep}>
              <Text>Next step</Text>
            </Button>
          </View>
        </>
      )}

      {screen === "location" && (
        <>
          <View>
            <Heading
              title="Select your location"
              subtitle="You're almost ready to get washed up!"
            />
            <View className="gap-4">
              <View>
                <Label className="mb-2">Location</Label>
                <Select
                  onValueChange={(value) => {
                    if (!value) return;
                    setLocation(value?.value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      className="text-foreground text-sm native:text-lg"
                      placeholder="Choose your location"
                    />
                  </SelectTrigger>
                  <SelectContent
                    insets={contentInsets}
                    className="flex w-[90%]"
                  >
                    <ScrollView className="max-h-72">
                      <SelectGroup>
                        {locations.map((loc) => (
                          <SelectItem
                            key={loc.id}
                            label={loc.address}
                            value={`${loc.id}`}
                          >
                            {loc.address}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </ScrollView>
                  </SelectContent>
                </Select>
                <InputError errors={errors} name="location" />
              </View>
              <View>
                <Label className="mb-2">Location verification code</Label>
                <Input
                  value={locationCode}
                  placeholder="Enter the location code..."
                  onChangeText={setLocationCode}
                />
                <InputError errors={errors} name="locationCode" />
              </View>
            </View>
          </View>
          <Button size="high" onPress={onNextStep}>
            <Text>Next step</Text>
          </Button>
        </>
      )}

      {screen === "verification" && (
        <>
          <View>
            <Heading
              title="Verify your account"
              subtitle="We've sent you an e-mail!"
            />
            <Label className="mb-2">Verification Code</Label>
            <Input
              value={code}
              placeholder="Enter verification code..."
              onChangeText={setCode}
            />
            <InputError errors={errors} name="code" />
          </View>
          <Button size="high" onPress={onVerify}>
            <Text>Verify</Text>
          </Button>
        </>
      )}
    </SafeAreaView>
  );
}
