import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Api } from "api";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LocationScreen } from "~/components/auth/LocationScreen";
import { UserInfoScreen } from "~/components/auth/UserInfoScreen";
import { VerificationScreen } from "~/components/auth/VerificationScreen";
import { Location } from "~/types";
import {
  LocationFormData,
  SignUpFormErrors,
  SignUpMetadata,
  UserInfoFormData,
} from "~/types/auth";

export default function SignUpScreen() {
  const api = new Api();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const [screen, setScreen] = useState<
    "userInfo" | "location" | "verification"
  >("userInfo");
  const [userInfo, setUserInfo] = useState<UserInfoFormData>({
    name: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  });
  const [locationData, setLocationData] = useState<LocationFormData>({
    location: "",
    locationCode: "",
  });
  const [code, setCode] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [metaData, setMetaData] = useState<SignUpMetadata>({});
  const [errors, setErrors] = useState<SignUpFormErrors>({});

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

  const handleUserInfoUpdate = (
    field: keyof UserInfoFormData,
    value: string
  ) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationUpdate = (
    field: keyof LocationFormData,
    value: string
  ) => {
    setLocationData((prev) => ({ ...prev, [field]: value }));
  };

  const onNextStep = async () => {
    if (screen === "userInfo") {
      const validate = await api.validateCredentials({
        name: userInfo.name,
        email: userInfo.emailAddress,
        password: userInfo.password,
        confirm_password: userInfo.confirmPassword,
      });

      if (validate?.success) {
        setScreen("location");
      } else {
        setErrors(validate);
      }
    } else if (screen === "location") {
      if (!isLoaded) return;
      if (locationData.location === "") {
        setErrors({ location: "Location is required" });
        return;
      }
      if (locationData.locationCode === "") {
        setErrors({ locationCode: "Location code is required" });
      }

      const selectedLocation = locations.find(
        (loc) => loc.id === parseInt(locationData.location)
      );

      if (selectedLocation?.code !== locationData.locationCode) {
        setErrors({ locationCode: "Invalid location code" });
        return;
      } else {
        try {
          await signUp.create({
            emailAddress: userInfo.emailAddress,
            password: userInfo.password,
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
          name: userInfo.name,
          email: userInfo.emailAddress,
          password: userInfo.password,
          location: locationData.location,
        });

        if (db_sign_up?.access_token) {
          setMetaData({
            access_token: db_sign_up.access_token,
            location: locationData.location,
            name: userInfo.name,
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

  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      {screen === "userInfo" && (
        <UserInfoScreen
          data={userInfo}
          errors={errors}
          onUpdate={handleUserInfoUpdate}
          onNext={onNextStep}
        />
      )}
      {screen === "location" && (
        <LocationScreen
          data={locationData}
          errors={errors}
          locations={locations}
          contentInsets={insets}
          onUpdate={handleLocationUpdate}
          onNext={onNextStep}
        />
      )}
      {screen === "verification" && (
        <VerificationScreen
          code={code}
          errors={errors}
          onCodeChange={setCode}
          onVerify={onVerify}
        />
      )}
    </SafeAreaView>
  );
}
