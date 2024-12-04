import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useGlobalSearchParams } from "expo-router/build/hooks";

export default function ScheduleModal() {
  const router = useRouter();
  const { id } = useGlobalSearchParams(); // Fetch dynamic ID

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Schedule ID: {id}</Text>
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}
