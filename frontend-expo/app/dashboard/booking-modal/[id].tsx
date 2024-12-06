import { useUser } from "@clerk/clerk-expo";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Machine, Schedule } from "~/types";

const today = toDateId(new Date());
// const data = [
//   {
//     id: 1,
//     type: "dry",
//     location_id: 1,
//     status: 1,
//     created_at: "2024-12-05T00:05:06.000000Z",
//     updated_at: "2024-12-05T00:05:06.000000Z",
//     location: {
//       id: 1,
//       code: "IRDS",
//       address: "Læssøesgade 53, 8000 Aarhus C",
//       latitude: "56.1473380",
//       longitude: "10.1911860",
//       created_at: "2024-12-04T23:59:26.000000Z",
//       updated_at: "2024-12-04T23:59:26.000000Z",
//     },
//   },
//   {
//     id: 2,
//     type: "wash",
//     location_id: 1,
//     status: 1,
//     created_at: "2024-12-05T00:05:09.000000Z",
//     updated_at: "2024-12-05T00:05:09.000000Z",
//     location: {
//       id: 1,
//       code: "IRDS",
//       address: "Læssøesgade 53, 8000 Aarhus C",
//       latitude: "56.1473380",
//       longitude: "10.1911860",
//       created_at: "2024-12-04T23:59:26.000000Z",
//       updated_at: "2024-12-04T23:59:26.000000Z",
//     },
//   },
// ];

export default function BookingModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser();

  if (!id) {
    router.back();
    return null;
  }

  const token = user?.publicMetadata?.access_token;
  if (!token) {
    console.error("No access token");
    return;
  }

  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setMachines] = useState<Machine[]>([]);
  const [events, setEvents] = useState<Schedule[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [bookedHours, setBookedHours] = useState<number[]>([]);

  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentMinutesPercentage = Math.round((currentMinutes / 60) * 100);

  const hours = Array.from({ length: 16 }, (_, i) => `${i + 8}:00`);
  const rentalTimes = data.map((item) => (item.type === "wash" ? 2 : 0));

  const api = new Api(token);

  async function getData() {
    const machine_data = await api.getMachines();
    const schedule_data = await api.getScheduleById(Number(id));
    const filteredMachines = machine_data.filter(
      (machine) => machine.id === Number(id)
    );
    setMachines(filteredMachines);
    setEvents(schedule_data);
  }
  getData();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setBookedHours([]);
    setIsBooking(false);
  }, [selectedDate]);

  const handleBookingPress = (hour: number) => {
    const startHour = hour;
    const endHour = hour + Math.max(...rentalTimes);
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

    const bookingData = data.map((item) => ({
      machine_type: item.type,
      machine_id: item.id,
      start_time: startTime.toISOString().replace("T", " ").substring(0, 19),
      end_time: endTime.toISOString().replace("T", " ").substring(0, 19),
    }));

    try {
      const output = await Promise.all(
        bookingData.map((data) => api.setSchedule(data))
      );
      console.log(output);
      router.back();
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
          currentHour >= eventStart - Math.max(...rentalTimes) &&
          currentHour < eventStart
        );
      });

    const isLastHours = index >= hours.length - Math.max(...rentalTimes);

    const isBooked = bookedHours.includes(hourNumber);

    return (
      <ScrollView key={index} className="relative">
        <View
          className={`flex-row ${isEvent ? "bg-secondary" : ""} ${
            isPastTime ? "bg-secondary" : ""
          }`}
        >
          {isCurrentTime && (
            <View
              className="absolute left-0 right-0 bg-primary"
              style={{
                top: `${currentMinutesPercentage}%`,
                height: 2,
              }}
            />
          )}
          <Text className="w-[15%] text-center p-2">{hour}</Text>
          <Separator orientation={"vertical"} />

          <Text className="p-2">
            {isEvent ? (
              "This time is reserved"
            ) : isBooked ? (
              <>
                <Check color={"#479e96"} size={20} className="" />
              </>
            ) : (
              ""
            )}
          </Text>
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
      </ScrollView>
    );
  });

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="p-6 sm:max-w-[425px]">
          <Heading title={`Details`} subtitle={`Machine #${events[0]?.id} `} />
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
          {renderHours}
          {isBooking && (
            <Button
              className="flex-col mt-4 self-center w-fit mx-6"
              onPress={handleBookNow}
            >
              <Text>Book now</Text>
            </Button>
          )}
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
