import { useAuth } from "~/context/auth";
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

/**
 * QR Component - Handles QR code scanning functionality
 * Uses the device camera to scan QR codes and navigate to booking modal
 */
export default function QR() {
  // Camera permission handling hooks
  const [permission, requestPermission] = useCameraPermissions();
  // State to track scanning status and camera activity
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  // Get authentication token for API calls
  const { token } = useAuth();

  // Effect to manage camera activation when screen is focused
  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
      return () => {
        setIsCameraActive(false); // Deactivate camera when screen is unfocused
      };
    }, [])
  );

  // Show empty view while permissions are loading
  if (!permission) {
    return <View />;
  }

  // Request camera permissions if not granted
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center gap-4">
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
      </SafeAreaView>
    );
  }

  /**
   * Handles successful QR code scanning
   */
  async function handleBarcodeScanned(scanningResult: BarcodeScanningResult) {
    // Prevent multiple simultaneous scans
    if (isScanning) return;
    setIsScanning(true);

    // Initialize API and fetch machine data
    const api = new Api(token);
    const machine = await api.getMachineByCode(scanningResult.data);

    // If machine found, navigate to booking modal
    if (machine) {
      setIsCameraActive(false);
      router.push({
        pathname: "/dashboard/booking-modal/[id]",
        params: { id: machine.id },
      });
    }
    setIsScanning(false);
  }
  return (
    <SafeAreaView className="flex-1 android:pt-2" edges={["top"]}>
      {isCameraActive && (
        <CameraView
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
          style={{ flex: 1 }}
          facing={"back"}
        >
          <View className="flex-1 flex-row justify-center items-center p-4">
            <View className="w-64 h-64 border-2 border-foreground rounded-lg"></View>
          </View>
        </CameraView>
      )}
    </SafeAreaView>
  );
}
