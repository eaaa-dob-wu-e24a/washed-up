import { Api } from "api";
import { Machine } from "types";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "~/components/heading";
import ScheduleCard from "~/components/schedule-card";
import { ScrollView } from "react-native-gesture-handler";

export default function Dashboard() {
  const { user } = useUser();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [schedule, setSchedule] = useState(true);

  useEffect(() => {
    const token = user?.publicMetadata?.access_token;
    if (!token) return;
    const api = new Api(token);

    async function getData() {
      const data = await api.getMachines();
      setMachines(data);
    }
    getData();
  }, [user]);

  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      <View className="gap-4">
        <Heading title={`Hello, ${user?.emailAddresses}`} />
        <Text className="text-2xl">Schedule</Text>
        {schedule ? (
          <ScrollView horizontal>
            <View className="flex flex-row gap-4">
              <ScheduleCard />
              <ScheduleCard />
            </View>
          </ScrollView>
        ) : (
          <Text>You currently don't have any scheduled times!</Text>
        )}
        {/* <View>
          {machines?.map((machine) => (
            <Text key={machine.id}>{machine.model}</Text>
          ))}
        </View> */}
        <Text className="text-2xl">All machines</Text>
      </View>
    </SafeAreaView>
  );
}
