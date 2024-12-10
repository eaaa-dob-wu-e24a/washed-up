import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import Heading from "~/components/heading";
import { Text } from "~/components/ui/text";
import { Schedule } from "~/types";

export default function ScheduleModal() {
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

  const [schedule, setSchedule] = useState<Schedule[] | null>(null);
  const [loading, setLoading] = useState(true);

  const api = new Api(token);

  const getData = async () => {
    const schedule_data = await api.getByScheduleId(Number(id));
    setSchedule(schedule_data);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    };

    fetchData();
  }, []);

  console.log(schedule);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="p-6 sm:max-w-[425px]">
          <Heading title={`Schedule Details`} subtitle={`Rental #${id}`} />
          {loading ? (
            <ActivityIndicator
              animating={true}
              size={64}
              color="#479e96"
              className="mt-48"
            />
          ) : (
            <></>
          )}
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
