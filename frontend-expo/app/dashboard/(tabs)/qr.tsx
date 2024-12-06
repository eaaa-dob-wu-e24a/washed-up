import { useUser } from "@clerk/clerk-expo";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function QR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
    }, [])
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView className="flex-1 justify-center items-center gap-4">
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
      </SafeAreaView>
    );
  }

  async function handleBarcodeScanned(scanningResult: BarcodeScanningResult) {
    if (isScanning) return;
    setIsScanning(true);
    const api = new Api(user?.publicMetadata?.access_token);
    const machine = await api.getMachineByCode(scanningResult.data);
    if (machine) {
      setIsCameraActive(false);
      router.push(`/dashboard/booking-modal/${machine.id}`);
    }
    setIsScanning(false);
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      {isCameraActive && (
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
      )}
    </SafeAreaView>
  );
}
