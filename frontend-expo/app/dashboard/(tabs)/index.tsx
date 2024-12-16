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
  // State management for component data
  const { token } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]); // Store list of machines
  const [schedule, setSchedule] = useState<Schedule[]>([]); // Store user schedules
  const [selectedBadge, setSelectedBadge] = useState("all"); // Filter state for machine types
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [currentSlogan, setCurrentSlogan] = useState(""); // Random slogan display
  const [userName, setUserName] = useState<string>(""); // Logged in user's name

  // Get notification context
  const { notification, expoPushToken, error } = useNotification();

  // Main data fetching function
  async function getData() {
    if (!token) return;
    const api = new Api(token);

    // Fetch user data and set name
    const [userData] = await api.getUser();
    setUserName(userData.name || "User");
    const user_id = userData.id;

    // Fetch machines and schedules
    const machine_data = await api.getMachines();
    const schedule_data = await api.getSchedules();

    // Filter schedules to show only current user's future schedules
    const filtered_schedule_data = schedule_data
      .filter((schedule) => {
        const currentTime = new Date();
        const scheduleEndTime = new Date(schedule.end_time);
        return schedule.user_id === user_id && scheduleEndTime >= currentTime;
      })
      .sort(
        (
          a,
          b // Sort schedules by start time
        ) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

    setMachines(machine_data);
    setSchedule(filtered_schedule_data);
  }

  // Auto-refresh data every minute
  useEffect(() => {
    const interval = setInterval(async () => {
      await getData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle pull-to-refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);

  // Initial data fetch when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    };
    fetchData();
  }, [token]);

  // Refresh data when screen comes into focus
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

  // Function to get random welcome slogan
  const getRandomSlogan = () => {
    const laundrySlogans = [
      "It's laundry day!",
      "It's time to get Washed Up!",
      "Fresh & Clean, Just Like Your Dreams",
      "Wash, Dry, Repeat!",
      "Keep Calm and Do Laundry",
      "Cleaning Clothes, Making Smiles",
      "Life is Better with Clean Laundry",
      "Stains Don't Stand a Chance",
      "Freshness Loading...",
      "Sort, Wash, Fold, Repeat",
      "Making Your Clothes Happy",
    ];
    const randomIndex = Math.floor(Math.random() * laundrySlogans.length);
    return laundrySlogans[randomIndex];
  };

  // Set initial random slogan
  useEffect(() => {
    setCurrentSlogan(getRandomSlogan());
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-between" edges={["top"]}>
      <ScrollView
        className="flex gap-4 p-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Heading title={`Hello, ${userName}`} subtitle={currentSlogan} />
        <Text className="text-2xl">Schedule</Text>
        {loading ? (
          <Skeleton className="rounded-lg w-full h-6" />
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
            className="py-3 px-6 rounded-full shadow"
            variant={selectedBadge === "all" ? "default" : "outline"}
            onPress={() => setSelectedBadge("all")}
          >
            <Text className="text-sm">All</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full shadow"
            variant={selectedBadge === "wash" ? "default" : "outline"}
            onPress={() => setSelectedBadge("wash")}
          >
            <Text className="text-sm">Washers</Text>
          </Button>
          <Button
            className="py-3 px-6 rounded-full shadow"
            variant={selectedBadge === "dry" ? "default" : "outline"}
            onPress={() => setSelectedBadge("dry")}
          >
            <Text className="text-sm">Dryers</Text>
          </Button>
        </View>
        {loading ? (
          <Skeleton className="rounded-lg w-full h-24" />
        ) : machines.length > 0 ? (
          <View className="gap-4 mb-20 w-full">
            {machines
              ?.filter((a) =>
                selectedBadge === "all" ? true : a.type === selectedBadge
              )
              .map((machine) => (
                <MachineCard
                  key={machine.id}
                  data={machine}
                  refreshing={refreshing}
                />
              ))}
          </View>
        ) : (
          <Text>Your location has no machines!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
