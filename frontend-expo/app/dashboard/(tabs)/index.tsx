import { Api } from "api";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Machine, Schedule } from "types";
import MachineCard from "~/components/dashboard/machine-card";
import ScheduleCard from "~/components/dashboard/schedule-card";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth";
import { useNotification } from "~/context/notification-context";

export default function Dashboard() {
  const { token } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedBadge, setSelectedBadge] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  const { notification, expoPushToken, error } = useNotification();

  async function getData() {
    if (!token) return;
    const api = new Api(token); // Use token directly from auth context

    const [userData] = await api.getUser();
    setUserName(userData.name || "User");
    const user_id = userData.id;

    const machine_data = await api.getMachines();
    const schedule_data = await api.getSchedules();
    const filtered_schedule_data = schedule_data
      .filter((schedule) => {
        const currentTime = new Date();
        const scheduleEndTime = new Date(schedule.end_time);
        return schedule.user_id === user_id && scheduleEndTime >= currentTime;
      })
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

    setMachines(machine_data);
    setSchedule(filtered_schedule_data);
  }

  // Rest of the useEffect hooks remain the same, just replace user with token in dependencies
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
    const fetchData = async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    };
    fetchData();
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        await getData();
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 justify-between" edges={["top"]}>
      <ScrollView
        className="flex gap-4 p-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Heading title={`Hello, ${userName}`} subtitle="It's laundry day!" />
        <Text className="text-2xl">Schedule</Text>
        {loading ? (
          <Skeleton className="rounded-lg w-full h-6 mt-4" />
        ) : schedule.length > 0 ? (
          <ScrollView
            className="-mx-6 mt-4"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className="px-6 flex flex-row gap-4 pb-4">
              {schedule?.map((schedule) => {
                const machine = machines.find(
                  (m) => m.id === schedule.machine_id
                );
                return (
                  <ScheduleCard
                    key={schedule.id}
                    data={schedule}
                    machine={machine as Machine}
                  />
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <Text>You currently don't have any scheduled times!</Text>
        )}
        <Text className="text-2xl mt-4">All machines</Text>
        <View className="flex flex-row justify-start gap-4 my-4">
          <Button
            className="py-3 px-6 rounded-full shadow shadow-slate-400 ios:shadow-black/5"
            variant={selectedBadge === "all" ? "default" : "outline"}
            onPress={() => setSelectedBadge("all")}
          >
            <Text className="text-sm">All</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full shadow shadow-slate-400 ios:shadow-black/5"
            variant={selectedBadge === "wash" ? "default" : "outline"}
            onPress={() => setSelectedBadge("wash")}
          >
            <Text className="text-sm">Washers</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full shadow shadow-slate-400 ios:shadow-black/5"
            variant={selectedBadge === "dry" ? "default" : "outline"}
            onPress={() => setSelectedBadge("dry")}
          >
            <Text className="text-sm">Dryers</Text>
          </Button>
        </View>
        {loading ? (
          <>
            <Skeleton className="rounded-lg w-full h-12 mt-4" />
            <Skeleton className="rounded-lg w-full h-12 mt-4" />
            <Skeleton className="rounded-lg w-full h-12 mt-4" />
          </>
        ) : machines.length > 0 ? (
          <View className="gap-4 mb-20 w-full">
            {machines
              ?.filter((a) =>
                selectedBadge === "all" ? true : a.type === selectedBadge
              )
              .map((machine) => {
                const scheduleItem = schedule.find(
                  (s) => s.machine_id === machine.id
                );
                return (
                  <MachineCard
                    key={machine.id}
                    data={machine}
                    schedule={scheduleItem as Schedule}
                  />
                );
              })}
          </View>
        ) : (
          <Text>Your location has no machines!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
