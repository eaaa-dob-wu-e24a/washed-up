import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth";
import { Schedule } from "~/types";

export default function ScheduleModal() {
  // Get schedule ID from URL params
  const { id } = useLocalSearchParams();
  // Get authentication token from context
  const { token } = useAuth();

  // Redirect if no ID provided
  if (!id) {
    router.back();
    return null;
  }

  // Handle missing authentication
  if (!token) {
    console.error("No access token");
    return null;
  }

  // State management
  const [schedule, setSchedule] = useState<Schedule[]>([]); // Store schedule data
  const [loading, setLoading] = useState(true); // Loading state
  const [deleteConfirm, setDeleteConfirm] = useState(false); // Delete confirmation modal state
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Initialize API with auth token
  const api = new Api(token);

  // Fetch schedule data from API
  const getData = async () => {
    const schedule_data = await api.getByScheduleId(Number(id));
    setSchedule(schedule_data);
  };

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-UK", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to format times
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-UK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle schedule cancellation
  const handleDelete = async () => {
    setBookingError(null);
    const result = await api.cancelSchedule(Number(id));

    if (result.success) {
      router.back();
    } else {
      setBookingError(`${result.error}`);
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="p-6 sm:max-w-[425px]">
          <Heading
            title={`Schedule Details`}
            subtitle={`Here's our information on your booking.`}
          />
          {loading ? (
            <ActivityIndicator
              animating={true}
              size={64}
              color="#479e96"
              className="mt-48"
            />
          ) : schedule.length > 0 ? (
            <View className="gap-4">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Rental Information</CardTitle>
                  <CardDescription>
                    Machine ID: {schedule[0].machine_id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Text>Date: {formatDate(schedule[0].start_time)}</Text>
                  <Text>Start Time: {formatTime(schedule[0].start_time)}</Text>
                  <Text>End Time: {formatTime(schedule[0].end_time)}</Text>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
                  <CardDescription>
                    Booking ID: {schedule[0].id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Text>User ID: {schedule[0].user_id}</Text>
                  <Text>
                    Date Created: {formatDate(schedule[0].created_at)}
                  </Text>
                  <Text>
                    Time Created: {formatTime(schedule[0].created_at)}
                  </Text>
                </CardContent>
              </Card>
              <Button
                variant={"destructive"}
                onPress={() => setDeleteConfirm(true)}
              >
                <Text>Cancel this Booking</Text>
              </Button>
            </View>
          ) : (
            <Text>No schedule data found!</Text>
          )}
        </SafeAreaView>
      </ScrollView>
      {deleteConfirm && (
        <View className="p-6 border-t border-secondary">
          <Text className="text-xl font-bold mb-4">Cancel Booking</Text>
          <Text>Do you wish to cancel this booking?</Text>
          <Text className="mb-2">Your credits will be refunded.</Text>
          {bookingError && (
            <Text className="mb-4 text-destructive font-medium">
              {bookingError}
            </Text>
          )}
          <View className="flex-row justify-between gap-4">
            <Button
              variant="outline"
              onPress={() => {
                setDeleteConfirm(false);
                setBookingError(null);
              }}
              className="flex-1"
            >
              <Text>No</Text>
            </Button>
            <Button
              onPress={handleDelete}
              className="flex-1"
              variant={"destructive"}
            >
              <Text>Yes</Text>
            </Button>
          </View>
        </View>
      )}
    </>
  );
}
