// app/(auth)/sign-up.tsx
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Api } from "~/api";
import { LocationScreen } from "~/components/auth/location-screen";
import { UserInfoScreen } from "~/components/auth/user-info-screen";
import type {
  Location,
  LocationFormData,
  SignUpFormErrors,
  UserInfoFormData,
} from "~/types";

export default function SignUpScreen() {
  const api = new Api();
  const insets = useSafeAreaInsets();

  const [screen, setScreen] = useState<"location" | "userInfo">("location");
  const [userInfo, setUserInfo] = useState<UserInfoFormData>({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });
  const [locationData, setLocationData] = useState<LocationFormData>({
    location: "",
    locationCode: "",
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getLocations() {
      const data = await api.getLocations();
      if (data) setLocations(data);
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
      if (locationData.location === "") {
        setErrors({ location: "Location is required!" });
        setIsLoading(false);
        return;
      }

      if (locationData.locationCode === "") {
        setErrors({ locationCode: "Location code is required!" });
        setIsLoading(false);
        return;
      }

      const selectedLocation = locations.find(
        (loc) => loc.id === parseInt(locationData.location)
      );

      if (selectedLocation?.code !== locationData.locationCode.toUpperCase()) {
        setErrors({ locationCode: "Invalid location code. Please try again!" });
        setIsLoading(false);
        return;
      }

      setScreen("userInfo");
      setIsLoading(false);
    } else if (screen === "userInfo") {
      try {
        const response = await api.signUp({
          name: userInfo.name,
          email: userInfo.email,
          password: userInfo.password,
          location: locationData.location,
        });

        if (response?.access_token) {
          await AsyncStorage.setItem("token", response.access_token);
          router.replace("/"); // Navigate to home screen
        } else {
          setErrors(response);
        }
      } catch (error) {
        console.error("Sign up error:", error);
        setErrors({ form: "An error occurred during sign up" });
      }
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
    </SafeAreaView>
  );
}
