import { useUser } from "@clerk/clerk-expo";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Api } from "~/api";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Machine } from "~/types";
import { Separator } from "./ui/separator";
import { Schedule } from "~/types";

// const events = [
//   {
//     id: 1,
//     user_id: 1,
//     machine_id: 1,
//     start_time: "2024-12-01 20:00:00",
//     end_time: "2024-12-01 23:00:00",
//   },
//   {
//     id: 2,
//     user_id: 2,
//     machine_id: 1,
//     start_time: "2024-12-01 09:00:00",
//     end_time: "2024-12-01 11:00:00",
//   },
//   {
//     id: 3,
//     user_id: 3,
//     machine_id: 1,
//     start_time: "2024-12-01 16:00:00",
//     end_time: "2024-12-01 19:00:00",
//   },
//   {
//     id: 4,
//     user_id: 3,
//     machine_id: 23,
//     start_time: "2024-12-01 04:00:00",
//     end_time: "2024-12-01 07:00:00",
//   },
// ];

const today = toDateId(new Date());

export default function MachineCard({ data }: { data: Machine }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<Schedule[]>([]);

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  // const filteredEvents = events.filter(
  //   (event) => toDateId(new Date(event.start_time)) === selectedDate
  // );

  function handleMachinePress() {
    setLoading(true);

    const token = user?.publicMetadata?.access_token;
    if (!token) {
      console.error("No access token");
      setLoading(false);
      return;
    }
    const api = new Api(token);

    console.log(`Machine ID pressed: ${data.id}`);

    async function getData() {
      const output = await api.getScheduleById(data.id);
      setEvents(output);
      console.log(output);
    }
    getData();

    setLoading(false);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger onPress={handleMachinePress}>
          <Card className="w-full shadow shadow-slate-900">
            <CardHeader className="flex-row justify-between">
              <View>
                <CardTitle className="capitalize">
                  {data.type === "wash"
                    ? "Washer"
                    : data.type === "dry"
                    ? "Dryer"
                    : data.type}
                </CardTitle>
                <CardDescription>#{data.id}</CardDescription>
              </View>
              <Text className="text-2xl mt-1">
                <Text
                  className={`text-2xl mt-1 ${
                    data.status === 0 ? "text-primary" : "text-destructive"
                  }`}>
                  {data.status === 0 ? "Available" : "In use"}
                </Text>
              </Text>
            </CardHeader>
          </Card>
        </DialogTrigger>
        {/* This is the dialog box */}
        <DialogContent className="sm:max-w-[425px] max-h-[90%]">
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
            <DialogDescription>
              This is machine #{data.id} and it is a {data.type} machine.
            </DialogDescription>
          </DialogHeader>
          <ScrollView>
            <View className="gap-2">
              <Calendar
                calendarActiveDateRanges={[
                  {
                    startId: selectedDate,
                    endId: selectedDate,
                  },
                ]}
                calendarMonthId={today}
                calendarFirstDayOfWeek={"monday"}
                calendarDayHeight={30}
                onCalendarDayPress={setSelectedDate}
              />
              <Text className="text-center">Selected date: {selectedDate}</Text>

              <View>
                {loading ? (
                  <Text>Loading...</Text>
                ) : (
                  hours.map((hour, index) => {
                    const isEvent = events.some((event) => {
                      const eventDate = toDateId(new Date(event.start_time));
                      if (eventDate !== selectedDate) return false;
                      const eventStart = new Date(event.start_time).getHours();
                      const eventEnd = new Date(event.end_time).getHours();
                      const currentHour = parseInt(hour);
                      return (
                        currentHour >= eventStart && currentHour < eventEnd
                      );
                    });
                    return (
                      <View key={index}>
                        <View
                          className={`flex-row ${
                            isEvent ? "bg-destructive" : ""
                          }`}>
                          <Text className="w-[15%] text-center p-2">
                            {hour}
                          </Text>
                          <Separator orientation={"vertical"} />
                          <Text className="p-2">
                            {isEvent ? "Machine used by..." : ""}
                          </Text>
                        </View>
                        <Separator />
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          </ScrollView>
          {/* <DialogFooter>
            <DialogClose asChild>
              <Button>
                <Text>OK</Text>
              </Button>
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
