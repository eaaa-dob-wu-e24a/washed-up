import { useUser } from "@clerk/clerk-expo";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useEffect, useState } from "react";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Machine, Schedule } from "~/types";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const today = toDateId(new Date());

export default function MachineCard({ data }: { data: Machine }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<Schedule[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [bookedHours, setBookedHours] = useState<number[]>([]);

  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentMinutesPercentage = Math.round((currentMinutes / 60) * 100);

  const hours = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`);
  const rentalTime = data.type === "dry" ? 0 : data.type === "wash" ? 2 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setBookedHours([]);
    setIsBooking(false);
  }, [selectedDate]);

  async function handleMachinePress() {
    setLoading(true);
    if (events.length > 0) {
      setEvents([]);
      setBookedHours([]);
    }

    const token = user?.publicMetadata?.access_token;
    if (!token) {
      console.error("No access token");
      setLoading(false);
      return;
    }
    const api = new Api(token);

    async function getData() {
      const output = await api.getScheduleById(data.id);
      setEvents(output);
    }
    getData();

    setLoading(false);
  }

  const handleBookingPress = (hour: number) => {
    const startHour = hour;
    const endHour = hour + rentalTime;
    const newBookedHours = [];
    for (let i = startHour; i <= endHour; i++) {
      newBookedHours.push(i);
    }
    setIsBooking(true);
    setBookedHours(newBookedHours);
  };

  const handleBookNow = async () => {
    const startTime = new Date(selectedDate);
    startTime.setHours(bookedHours[0], 0, 0);
    const endTime = new Date(selectedDate);
    endTime.setHours(bookedHours[bookedHours.length - 1] + 1, 0, 0);

    // Add 1 hour to convert from UTC to UTC+1
    startTime.setHours(startTime.getHours() + 1);
    endTime.setHours(endTime.getHours() + 1);

    console.log("UTC+1 Start Time:", startTime.toISOString());
    console.log("UTC+1 End Time:", endTime.toISOString());

    const token = user?.publicMetadata?.access_token;
    if (!token) {
      console.error("No access token");
      return;
    }

    const api = new Api(token);

    const userResponse = await api.getUser();
    const userId = userResponse[0]?.id;

    const bookingData = {
      user_id: userId,
      machine_id: data.id,
      start_time: startTime.toISOString().replace("T", " ").substring(0, 19),
      end_time: endTime.toISOString().replace("T", " ").substring(0, 19),
    };

    try {
      const output = await api.setSchedule(bookingData);
      console.log(output);
    } catch (error) {
      console.error("Error setting schedule:", error);
    }
  };

  const renderHours = hours.map((hour, index) => {
    const hourNumber = parseInt(hour);
    const isCurrentTime = selectedDate === today && currentHour === hourNumber;

    const isEvent =
      Array.isArray(events) &&
      events.some((event) => {
        const eventDate = toDateId(new Date(event.start_time));

        if (eventDate !== selectedDate) return false;

        const eventStart = new Date(event.start_time).getHours();
        const eventEnd = new Date(event.end_time).getHours();
        const currentHour = hourNumber;

        return currentHour >= eventStart && currentHour < eventEnd;
      });

    const isPastTime =
      selectedDate < today ||
      (selectedDate === today && hourNumber < currentHour);

    const isWithinTwoHoursBeforeEvent =
      Array.isArray(events) &&
      events.some((event) => {
        const eventDate = toDateId(new Date(event.start_time));
        if (eventDate !== selectedDate) return false;

        const eventStart = new Date(event.start_time).getHours();
        const currentHour = hourNumber;

        return (
          currentHour >= eventStart - rentalTime && currentHour < eventStart
        );
      });

    const isLastHours = index >= hours.length - rentalTime;

    const isBooked = bookedHours.includes(hourNumber);

    return (
      <View key={index} className="relative">
        {isCurrentTime && (
          <View
            className="absolute left-0 right-0 bg-primary"
            style={{
              top: `${currentMinutesPercentage}%`,
              height: 2,
            }}
          />
        )}
        <View
          className={`flex-row ${isEvent ? "bg-secondary" : ""} ${
            isPastTime ? "bg-secondary" : ""
          } ${isBooked ? "border border-primary" : ""}`}
        >
          <Text className="w-[15%] text-center p-2">{hour}</Text>
          <Separator orientation={"vertical"} />

          <Text className="p-2">{isEvent ? "Machine used by..." : ""}</Text>
          {!isPastTime &&
            !isEvent &&
            !isWithinTwoHoursBeforeEvent &&
            !isLastHours && (
              <Text
                onPress={() => handleBookingPress(hourNumber)}
                className="py-2 px-4 flex self-end text-primary text-right ml-auto"
              >
                Book this time
              </Text>
            )}
        </View>
        <Separator />
      </View>
    );
  });

  return (
    <>
      <Dialog>
        {data.status === 1 ? (
          <DialogTrigger onPress={handleMachinePress}>
            <Card className="w-full shadow shadow-slate-400">
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
                      data.status === 1 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {data.status === 1 ? "Available" : "Disabled"}
                  </Text>
                </Text>
              </CardHeader>
            </Card>
          </DialogTrigger>
        ) : (
          <Card className="w-full shadow shadow-slate-400">
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
                <Text className="text-2xl mt-1 text-destructive">Disabled</Text>
              </Text>
            </CardHeader>
          </Card>
        )}
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
                {loading ? <Text>Loading...</Text> : <>{renderHours}</>}
              </View>
            </View>
          </ScrollView>
          {isBooking && (
            <DialogFooter>
              <DialogClose asChild>
                <Button onPress={handleBookNow}>
                  <Text>Book now</Text>
                </Button>
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
