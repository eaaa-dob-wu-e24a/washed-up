import { Calendar, Clock, WashingMachine } from "lucide-react-native";
import { View } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Machine, Schedule } from "~/types";

export default function ScheduleCard({
  data,
  machine,
}: {
  data: Schedule;
  machine: Machine;
}) {
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);

  if (endTime.getTime() <= Date.now()) {
    return null;
  }

  const formattedStartTime = startTime.toLocaleDateString("en-UK", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const formattedTimeRange = `${startTime.toLocaleTimeString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${endTime.toLocaleTimeString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  const timeUntilStartInMinutes = Math.max(
    0,
    Math.floor((startTime.getTime() - Date.now()) / 1000 / 60)
  ); // in minutes

  const hours = Math.floor(timeUntilStartInMinutes / 60);
  const minutes = timeUntilStartInMinutes % 60;
  const timeUntilStart = `${hours}h ${minutes}m`;

  const getStatus = () => {
    const now = new Date();
    if (now >= startTime && now <= endTime) {
      return "In progress";
    }
    return "Ready";
  };

  const status = getStatus();

  return (
    <>
      <Card className="w-72 shadow shadow-slate-400 ios:shadow-black/5">
        <CardHeader>
          <CardTitle>{machine?.type === "dry" ? "Dryer" : "Washer"}</CardTitle>
          <CardDescription>Machine #{machine?.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pl-5">
          <View className="flex flex-row">
            <Calendar color={"#479e96"} height={20} />
            <Text className="ml-1">{formattedStartTime}</Text>
          </View>
          <View className="flex flex-row">
            <Clock color={"#479e96"} height={20} />
            <Text className="ml-1">{formattedTimeRange}</Text>
          </View>
        </CardContent>
        <CardFooter className="flex-row pl-5">
          <WashingMachine color={"#479e96"} size={40} />
          <View className="ml-2">
            <Text>Starts in: {timeUntilStart}</Text>
            <Text>
              Status:{" "}
              <Text
                className={
                  status === "Ready" ? "text-primary" : "text-destructive"
                }
              >
                {status}
              </Text>
            </Text>
          </View>
        </CardFooter>
      </Card>
    </>
  );
}
