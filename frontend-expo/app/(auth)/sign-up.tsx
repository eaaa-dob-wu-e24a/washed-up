import { useSignUp, useUser } from "@clerk/clerk-expo";
import { Api } from "api";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LocationScreen } from "~/components/auth/location-screen";
import { UserInfoScreen } from "~/components/auth/user-info-screen";
import { VerificationScreen } from "~/components/auth/verification-screen";
import { Location } from "~/types";
import {
  LocationFormData,
  SignUpFormErrors,
  SignUpMetadata,
  UserInfoFormData,
} from "~/types";

export default function SignUpScreen() {
  const api = new Api();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const [screen, setScreen] = useState<
    "location" | "userInfo" | "verification"
  >("location");
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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    if (screen === "location") {
      if (!isLoaded) return;
      console.log("is loaded");
      if (locationData.location === "") {
        setErrors({ location: "Location is required" });
        setIsLoading(false);
        return;
      }
      console.log("location is good");
      if (locationData.locationCode === "") {
        setErrors({ locationCode: "Location code is required" });
        setIsLoading(false);
        return;
      }

      console.log("location code is good");

      const selectedLocation = locations.find(
        (loc) => loc.id === parseInt(locationData.location)
      );

      console.log("selected location", selectedLocation);
      if (selectedLocation?.code !== locationData.locationCode.toUpperCase()) {
        console.log(
          selectedLocation?.code,
          locationData.locationCode.toUpperCase(),
          "invalid"
        );
        setErrors({ locationCode: "Invalid location code" });
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        setScreen("userInfo");
      }
    } else if (screen === "userInfo") {
      const validate = await api.validateCredentials({
        name: userInfo.name,
        email: userInfo.emailAddress,
        password: userInfo.password,
        confirm_password: userInfo.confirmPassword,
      });

      if (validate?.success) {
        try {
          await signUp?.create({
            emailAddress: userInfo.emailAddress,
            password: userInfo.password,
          });
          await signUp?.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setScreen("verification");
          setIsLoading(false);
        } catch (err: any) {
          console.error(JSON.stringify(err, null, 2));
          setIsLoading(false);
        }
      } else {
        setErrors(validate);
        setIsLoading(false);
      }
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    if (code === "") {
      setErrors({ code: "Verification code is required" });
      setIsLoading(false);
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
      setIsLoading(false);
    } catch (err: any) {
      setErrors({ code: "Invalid verification code" });
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      {screen === "location" && (
        <LocationScreen
          isLoading={isLoading}
          data={locationData}
          errors={errors}
          locations={locations}
          contentInsets={insets}
          onUpdate={handleLocationUpdate}
          onNext={onNextStep}
        />
      )}
      {screen === "userInfo" && (
        <UserInfoScreen
          isLoading={isLoading}
          data={userInfo}
          errors={errors}
          onUpdate={handleUserInfoUpdate}
          onNext={onNextStep}
        />
      )}
      {screen === "verification" && (
        <VerificationScreen
          isLoading={isLoading}
          code={code}
          errors={errors}
          onCodeChange={setCode}
          onVerify={onVerify}
        />
      )}
    </SafeAreaView>
  );
}
