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
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import MachineCard from "~/components/machine-card";

export default function Dashboard() {
  const { user } = useUser();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [schedule, setSchedule] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState("all");

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
    <SafeAreaView className="h-screen justify-between">
      <ScrollView className="flex gap-4 p-6">
        <Heading title={`Hello, ${user?.publicMetadata?.name}`} />
        <Text className="text-2xl">Schedule</Text>
        {schedule ? (
          <ScrollView className="-mx-6 mt-4" horizontal>
            <View className="px-6 flex flex-row gap-4 pb-4">
              <ScheduleCard />
              <ScheduleCard />
            </View>
          </ScrollView>
        ) : (
          <Text>You currently don't have any scheduled times!</Text>
        )}
        <Text className="text-2xl mt-4">All machines</Text>
        <View className="flex flex-row justify-start gap-4 my-4">
          <Button
            className="py-3 px-6 rounded-full"
            variant={selectedBadge === "all" ? "default" : "outline"}
            onPress={() => setSelectedBadge("all")}
          >
            <Text className="text-sm">All</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full"
            variant={selectedBadge === "wash" ? "default" : "outline"}
            onPress={() => setSelectedBadge("wash")}
          >
            <Text className="text-sm">Washers</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full"
            variant={selectedBadge === "dry" ? "default" : "outline"}
            onPress={() => setSelectedBadge("dry")}
          >
            <Text className="text-sm">Dryers</Text>
          </Button>
        </View>
        {machines ? (
          <View className="gap-4 mb-20">
            {machines
              ?.filter((a) =>
                selectedBadge === "all" ? true : a.model === selectedBadge
              )
              .map((machine) => (
                <MachineCard key={machine.id} data={machine} />
              ))}
          </View>
        ) : (
          <Text>Your location has no machines!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
