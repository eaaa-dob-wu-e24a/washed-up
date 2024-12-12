import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Location } from "~/types";
import { LocationFormData, SignUpFormErrors } from "~/types";
import { useEffect, useState } from "react";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Api } from "~/api";
import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { getDistance } from "geolib";

interface LocationScreenProps {
  data: LocationFormData;
  errors: SignUpFormErrors;
  locations: Location[];
  contentInsets: { top: number; bottom: number; left: number; right: number };
  onUpdate: (field: keyof LocationFormData, value: string) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function LocationScreen({
  isLoading,
  data,
  errors,
  locations,
  contentInsets,
  onUpdate,
  onNext,
}: LocationScreenProps) {
  const [tab, setTab] = useState<"qr" | "manual">("qr");

  return (
    <>
      <View>
        <Heading
          title="Select your location"
          subtitle="You're almost ready to get washed up!"
        />
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as "qr" | "manual")}
          className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full mb-4">
            <TabsTrigger className="flex-1" value="qr">
              <Text>QR Code</Text>
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="manual">
              <Text>Manual</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="qr">
            <QRCodeLocationForm
              data={data}
              onUpdate={onUpdate}
              onNext={onNext}
            />
          </TabsContent>
          <TabsContent value="manual">
            <ManualLocationForm
              data={data}
              errors={errors}
              onUpdate={onUpdate}
              locations={locations}
              contentInsets={contentInsets}
            />
          </TabsContent>
        </Tabs>
      </View>

      <Button size="high" onPress={onNext} disabled={isLoading}>
        <Text>{isLoading ? "Loading..." : "Next step"}</Text>
      </Button>
    </>
  );
}

function QRCodeLocationForm({
  data,
  onUpdate,
  onNext,
}: {
  data: LocationFormData;
  onUpdate: (field: keyof LocationFormData, value: string) => void;
  onNext: () => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (data.location && data.locationCode) {
      onNext();
    }
  }, [data.location, data.locationCode]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="h-[400px] justify-center items-center gap-4">
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
      </View>
    );
  }

  async function handleBarcodeScanned(scanningResult: BarcodeScanningResult) {
    if (isScanning) return;
    setIsScanning(true);
    const api = new Api();
    const location = await api.getLocationByCode(scanningResult.data);

    if (location) {
      onUpdate("location", location.id.toString());
      onUpdate("locationCode", location.code);

      return;
    }
    setIsScanning(false);
  }

  return (
    <View className="h-[400px]">
      <CameraView
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
        style={{ flex: 1 }}
        facing={"back"}
      >
        <View className="flex-1 flex-row justify-center items-center p-4">
          <View className="w-64 h-64 border-2 border-background rounded-lg"></View>
        </View>
      </CameraView>
    </View>
  );
}

function ManualLocationForm({
  data,
  errors,
  onUpdate,
  locations,
  contentInsets,
}: {
  data: LocationFormData;
  errors: SignUpFormErrors;
  onUpdate: (field: keyof LocationFormData, value: string) => void;
  locations: Location[];
  contentInsets: { top: number; bottom: number; left: number; right: number };
}) {
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  const coordinates = location?.coords;

  // Calculate distances and sort locations
  const sortedLocations = locations
    .map((loc) => {
      const distance = coordinates
        ? getDistance(
            {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            },
            {
              latitude: String(loc.latitude),
              longitude: String(loc.longitude),
            }
          )
        : 0;
      return { ...loc, distance };
    })
    .sort((a, b) => a.distance - b.distance);

  return (
    <View className="gap-4">
      <View>
        <Label className="mb-2">Location</Label>
        <Select
          onValueChange={(value) => {
            if (!value) return;
            onUpdate("location", value.value);
          }}
        >
          <SelectTrigger>
            <SelectValue
              className="text-foreground text-sm native:text-lg"
              placeholder="Choose your location"
            />
          </SelectTrigger>
          <SelectContent insets={contentInsets} className="flex w-[90%]">
            <ScrollView className="max-h-72">
              <SelectGroup>
                {sortedLocations.map((loc) => (
                  <SelectItem
                    key={loc.id}
                    label={`(${Number(loc.distance / 1000).toFixed(1)} km) ${
                      loc.address
                    } `}
                    value={`${loc.id}`}
                  />
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
          value={data.locationCode}
          placeholder="Enter the location code..."
          className="placeholder:text-foreground"
          keyboardType="visible-password"
          onChangeText={(value) => onUpdate("locationCode", value)}
        />
        <InputError errors={errors} name="locationCode" />
      </View>
    </View>
  );
}
