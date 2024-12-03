import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function QR() {
  const [permission, requestPermission] = useCameraPermissions();

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

  function handleBarcodeScanned(scanningResult: BarcodeScanningResult) {
    console.log(scanningResult);
  }

  return (
    <SafeAreaView className="flex-1">
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
    </SafeAreaView>
  );
}
