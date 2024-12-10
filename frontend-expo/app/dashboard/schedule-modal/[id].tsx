import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "~/components/heading";
import { Text } from "~/components/ui/text";

export default function ScheduleModal() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();

  if (!id) {
    router.back();
    return null;
  }

  const token = user?.publicMetadata?.access_token;
  if (!token) {
    console.error("No access token");
    return;
  }
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="p-6 sm:max-w-[425px]">
          <Heading title={`Schedule Details`} subtitle={`Rental #${id}`} />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
