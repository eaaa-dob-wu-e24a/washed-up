import React from "react";
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

const today = toDateId(new Date()); // Get today's date in calendar-compatible format

export default function BookingModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token } = useAuth();

  // Authentication & validation checks
  if (!id) {
    router.back();
    return null;
  }

  if (!token) {
    console.error("No access token");
    return null;
  }

  // State management
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setMachines] = useState<Machine[]>([]); // Stores machine details
  const [events, setEvents] = useState<Schedule[]>([]); // Stores existing bookings
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBooking, setIsBooking] = useState(false); // Controls booking confirmation modal
  const [bookedHours, setBookedHours] = useState<number[]>([]); // Selected time slots
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Time calculations for UI display
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentMinutesPercentage = Math.round((currentMinutes / 60) * 100);

  const hours = Array.from({ length: 14 }, (_, i) => `${i + 8}:00`); // Generate 8:00 - 22:00 hours
  const rentalTimes = data.map((item) => (item.type === "wash" ? 2 : 0)); // Washing machines require 3 hours

  const api = new Api(token);

  // Fetch machine and schedule data
  async function getData() {
    const machine_data = await api.getMachines();
    const schedule_data = await api.getScheduleById(Number(id));
    const filteredMachines = machine_data.filter(
      (machine) => machine.id === Number(id)
    );
    setMachines(filteredMachines);
    setEvents(schedule_data);
  }

  // Initial data loading
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Reset booking state when date changes
  useEffect(() => {
    setBookedHours([]);
    setIsBooking(false);
  }, [selectedDate]);

  // Handle time slot selection
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

  // Submit booking to API
  const handleBookNow = async () => {
    setBookingError(null);

    // Calculate booking start/end times
    const startTime = new Date(selectedDate);
    startTime.setHours(bookedHours[0], 0, 0);
    const endTime = new Date(selectedDate);
    endTime.setHours(bookedHours[bookedHours.length - 1] + 1, 0, 0);

    // Adjust for timezone
    startTime.setHours(startTime.getHours() + 1);
    endTime.setHours(endTime.getHours() + 1);

    // Prepare booking data
    const bookingData = {
      machine_type: data[0].type,
      machine_id: data[0].id,
      start_time: startTime.toISOString().replace("T", " ").substring(0, 19),
      end_time: endTime.toISOString().replace("T", " ").substring(0, 19),
    };

    try {
      const response = await api.setSchedule(bookingData);

      if (response) {
        if (response.id) {
          // Schedule created successfully
          router.back();
        } else if (response.error) {
          setBookingError(response.error);
        }
      } else {
        setBookingError("Unable to create booking");
      }
    } catch (error) {
      setBookingError("An error occurred while booking");
    }
  };

  // Render time slots with availability status
  const renderHours = hours.map((hour, index) => {
    const hourNumber = parseInt(hour);
    const isCurrentTime = selectedDate === today && currentHour === hourNumber;

    // Check if slot is already booked
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

    // Additional availability checks
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

    // Render time slots
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
          <Separator orientation={"vertical"} className="dark:bg-border" />

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
        <Separator className="dark:bg-border" />
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
              <Separator className="dark:bg-border" />
              {renderHours}
            </>
          )}
        </SafeAreaView>
      </ScrollView>
      {isBooking && (
        <View className="p-6 border-t border-secondary">
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
            <Text className="mb-4 text-destructive font-medium">
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
