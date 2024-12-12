import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Api } from "~/api";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth";
import { Machine, Schedule } from "~/types";
import { Skeleton } from "../ui/skeleton";

export default function MachineCard({ data }: { data: Machine }) {
  const router = useRouter();
  const { token } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  async function getData() {
    if (!token) return;
    const api = new Api(token);
    const schedule_data = await api.getScheduleById(data.id);
    setSchedules(schedule_data);
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

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

  const isInProgress = schedules.some((schedule) => {
    const start = new Date(schedule.start_time);
    const end = new Date(schedule.end_time);
    const now = new Date();
    return now >= start && now <= end;
  });

  return (
    <>
      {loading ? (
        <Skeleton className="rounded-lg w-full h-24" />
      ) : (
        <Pressable
          disabled={data.status !== 1}
          onPress={() =>
            router.push({
              pathname: "/dashboard/booking-modal/[id]",
              params: { id: data.id },
            })
          }
        >
          <Card
            className={`${
              data.status !== 1 ? "opacity-50" : "shadow shadow-foreground"
            }`}
          >
            <CardHeader className="flex gap-4 flex-row justify-between">
              <View className="self-center">
                <CardTitle className="capitalize">
                  {data.type === "wash"
                    ? "Washer"
                    : data.type === "dry"
                    ? "Dryer"
                    : data.type}
                </CardTitle>
                <CardDescription>Machine #{data.id}</CardDescription>
              </View>
              <Text
                className={`text-2xl self-center ${
                  isInProgress
                    ? "text-destructive"
                    : data.status === 1
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {isInProgress
                  ? "In progress"
                  : data.status === 1
                  ? "Available"
                  : "Disabled"}
              </Text>
            </CardHeader>
          </Card>
        </Pressable>
      )}
    </>
  );
}
