import { useAuth } from "~/context/auth";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Machine, Schedule } from "~/types";

const today = toDateId(new Date());

export default function BookingModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token } = useAuth();

  if (!id) {
    router.back();
    return null;
  }

  if (!token) {
    console.error("No access token");
    return null;
  }

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setMachines] = useState<Machine[]>([]);
  const [events, setEvents] = useState<Schedule[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [bookedHours, setBookedHours] = useState<number[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentMinutesPercentage = Math.round((currentMinutes / 60) * 100);

  const hours = Array.from({ length: 14 }, (_, i) => `${i + 8}:00`);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    };

    fetchData();
  }, []);

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
    setBookingError(null); // Reset error state
    const startTime = new Date(selectedDate);
    startTime.setHours(bookedHours[0], 0, 0);
    const endTime = new Date(selectedDate);
    endTime.setHours(bookedHours[bookedHours.length - 1] + 1, 0, 0);

    startTime.setHours(startTime.getHours() + 1);
    endTime.setHours(endTime.getHours() + 1);

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

      // Check if response contains error
      if (output.some((res) => res.error === "Insufficient credits")) {
        setBookingError("You don't have enough credits for this booking");
        return;
      }

      console.log(output);
      router.back();
    } catch (error) {
      console.error("Error setting schedule:", error);
      setBookingError("An error occurred while booking");
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
          <Text className="w-[20%] text-center p-2">{hour}</Text>
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
          <Heading
            title={`Details`}
            subtitle={
              loading
                ? undefined
                : `You're now booking ${
                    data[0]?.type === "dry" ? "Dryer" : "Washer"
                  } #${data[0]?.id}`
            }
          />
          {loading ? (
            <ActivityIndicator
              animating={true}
              size={64}
              color="#479e96"
              className="mt-48"
            />
          ) : (
            <>
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
              <Text className="text-center pb-2">
                Selected date: {selectedDate}
              </Text>
              <Separator />
              {renderHours}
            </>
          )}
        </SafeAreaView>
      </ScrollView>
      {isBooking && (
        <View className="bg-white p-6 border border-slate-200">
          <Text className="text-xl font-bold mb-4">Confirm Booking</Text>
          <Text className="mb-2">
            {data[0]?.type === "dry" ? "Dryer" : "Washer"} #{data[0]?.id}
          </Text>
          <Text className="mb-2">Date: {selectedDate}</Text>
          <Text className="mb-4">
            Time: {bookedHours[0]}:00 -{" "}
            {bookedHours[bookedHours.length - 1] + 1}:00
          </Text>

          {bookingError && (
            <Text className="mb-4 text-red-500 font-medium">
              {bookingError}
            </Text>
          )}

          <View className="flex-row justify-between gap-4">
            <Button
              variant="outline"
              onPress={() => {
                setIsBooking(false);
                setBookingError(null);
              }}
              className="flex-1"
            >
              <Text>Cancel</Text>
            </Button>
            <Button onPress={handleBookNow} className="flex-1">
              <Text>Confirm Booking</Text>
            </Button>
          </View>
        </View>
      )}
    </>
  );
}
