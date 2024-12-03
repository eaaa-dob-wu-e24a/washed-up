import { useUser } from "@clerk/clerk-expo";
import { Api } from "api";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Machine, Schedule } from "types";
import Heading from "~/components/heading";
import MachineCard from "~/components/machine-card";
import ScheduleCard from "~/components/schedule-card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Dashboard() {
  const { user } = useUser();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedBadge, setSelectedBadge] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  async function getData() {
    const token = user?.publicMetadata?.access_token;
    if (!token) return;
    const api = new Api(token);

    const machine_data = await api.getMachines();
    const schedule_data = await api.getSchedules();
    console.log(schedule_data);
    setMachines(machine_data);
    setSchedule(schedule_data);
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await getData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await getData();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    getData();
  }, [user]);

  return (
    <SafeAreaView className="h-screen justify-between">
      <ScrollView
        className="flex gap-4 p-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Heading title={`Hello, ${user?.publicMetadata?.name}`} />
        <Text className="text-2xl">Schedule</Text>
        {schedule.length > 0 ? (
          <ScrollView
            className="-mx-6 mt-4"
            horizontal
            showsHorizontalScrollIndicator={false}>
            <View className="px-6 flex flex-row gap-4 pb-4">
              {schedule?.map((schedule) => (
                <ScheduleCard key={schedule.id} data={schedule} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text>You currently don't have any scheduled times!</Text>
        )}
        <Text className="text-2xl mt-4">All machines</Text>
        <View className="flex flex-row justify-start gap-4 my-4">
          <Button
            className="py-3 px-6 rounded-full shadow shadow-slate-900"
            variant={selectedBadge === "all" ? "default" : "outline"}
            onPress={() => setSelectedBadge("all")}>
            <Text className="text-sm">All</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full shadow shadow-slate-900"
            variant={selectedBadge === "wash" ? "default" : "outline"}
            onPress={() => setSelectedBadge("wash")}>
            <Text className="text-sm">Washers</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full shadow shadow-slate-900"
            variant={selectedBadge === "dry" ? "default" : "outline"}
            onPress={() => setSelectedBadge("dry")}>
            <Text className="text-sm">Dryers</Text>
          </Button>
        </View>
        {machines ? (
          <View className="gap-4 mb-20">
            {machines
              ?.filter((a) =>
                selectedBadge === "all" ? true : a.type === selectedBadge
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
