import { useRouter } from "expo-router";
import { Calendar, Clock, WashingMachine } from "lucide-react-native";
import { Pressable, View } from "react-native";
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

// ScheduleCard component displays information about a laundry machine schedule
export default function ScheduleCard({
  data,
  machine,
}: {
  data: Schedule;
  machine: Machine;
}) {
  // Convert schedule times to Date objects
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);
  const router = useRouter();

  // Don't render anything if the schedule has already ended
  if (endTime.getTime() <= Date.now()) {
    return null;
  }

  // Format the start date to display weekday, month and day
  const formattedStartTime = startTime.toLocaleDateString("en-UK", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Format the time range to show start and end times
  const formattedTimeRange = `${startTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${endTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  // Determine the current status of the schedule
  const getStatus = () => {
    const now = new Date();
    if (now >= startTime && now <= endTime) {
      return "In progress";
    }
    return "Ready";
  };

  // Calculate and format time remaining until start or end of schedule
  const getTimeDisplay = () => {
    const now = new Date();

    if (now < startTime) {
      // Calculate time until schedule starts
      const timeUntilStartInMinutes = Math.floor(
        (startTime.getTime() - now.getTime()) / 1000 / 60
      );
      const hours = Math.floor(timeUntilStartInMinutes / 60);
      const minutes = timeUntilStartInMinutes % 60;
      return `Starts in: ${hours}h ${minutes}m`;
    } else if (now <= endTime) {
      // Calculate time until schedule ends
      const timeUntilEndInMinutes = Math.floor(
        (endTime.getTime() - now.getTime()) / 1000 / 60
      );
      const hours = Math.floor(timeUntilEndInMinutes / 60);
      const minutes = timeUntilEndInMinutes % 60;
      return `Ends in: ${hours}h ${minutes}m`;
    }
    return "Completed";
  };

  const timeDisplay = getTimeDisplay();
  const status = getStatus();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/dashboard/schedule-modal/[id]",
          params: { id: data.id },
        })
      }
    >
      <Card className="w-72 shadow">
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
            <Text>{timeDisplay}</Text>
            <Text>
              Status:&nbsp;
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
    </Pressable>
  );
}
