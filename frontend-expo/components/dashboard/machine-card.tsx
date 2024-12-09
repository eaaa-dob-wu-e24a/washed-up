import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Machine, Schedule } from "~/types";

export default function MachineCard({
  data,
  schedule,
}: {
  data: Machine;
  schedule: Schedule;
}) {
  const router = useRouter();
  const isInProgress = schedule
    ? (() => {
        const currentTime = new Date();
        const startTime = new Date(schedule.start_time);
        const endTime = new Date(schedule.end_time);
        return currentTime >= startTime && currentTime <= endTime;
      })()
    : false;

  return (
    <Pressable
      onPress={() => router.push(`/dashboard/booking-modal/${data.id}`)}
    >
      <Card className="shadow shadow-slate-400 ios:shadow-black/5">
        <CardHeader className="flex gap-4 flex-row justify-between">
          <View>
            <CardTitle className="capitalize">
              {data.type === "wash"
                ? "Washer"
                : data.type === "dry"
                ? "Dryer"
                : data.type}
            </CardTitle>
            <CardDescription>Machine #{data.id}</CardDescription>
          </View>
          <Text className="text-2xl mt-1">
            <Text
              className={`text-2xl mt-1 ${
                isInProgress
                  ? "text-destructive"
                  : data.status === 1
                  ? "text-primary"
                  : "text-destructive"
              }`}
            >
              {isInProgress
                ? "In progress"
                : data.status === 1
                ? "Available"
                : "Disabled"}
            </Text>
          </Text>
        </CardHeader>
      </Card>
    </Pressable>
  );
}
