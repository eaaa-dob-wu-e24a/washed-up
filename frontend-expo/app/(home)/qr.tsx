import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";

export default function QR() {
  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      <View>
        <Text>My Page</Text>
      </View>
    </SafeAreaView>
  );
}
