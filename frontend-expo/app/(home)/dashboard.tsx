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
        <Separator />
        <Text className="text-2xl">All machines</Text>
        <View className="flex flex-row justify-start gap-4">
          <Button
            className="py-3 px-6 rounded-full"
            variant={selectedBadge === "all" ? "default" : "outline"}
            onPress={() => setSelectedBadge("all")}>
            <Text className="text-sm">All</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full"
            variant={selectedBadge === "wash" ? "default" : "outline"}
            onPress={() => setSelectedBadge("wash")}>
            <Text className="text-sm">Washers</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full"
            variant={selectedBadge === "dry" ? "default" : "outline"}
            onPress={() => setSelectedBadge("dry")}>
            <Text className="text-sm">Dryers</Text>
          </Button>
        </View>
        {machines ? (
          <ScrollView>
            <View className="gap-4">
              {machines?.map((machine) => (
                <MachineCard key={machine.id} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text>Your location has no machines!</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
