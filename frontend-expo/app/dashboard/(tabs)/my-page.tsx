import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Credits as CreditsType } from "~/types";
import Credits from "~/components/my-page/credits";
import Heading from "~/components/heading";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

export default function MyPage() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [credits, setCredits] = useState<CreditsType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchCredits() {
    const api = new Api(user?.publicMetadata.access_token);
    const credits = await api.getCredits();
    setCredits(credits);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await fetchCredits();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchCredits();
  }, [user]);

  if (!user) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 p-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Heading title="My Page" subtitle="Manage your account" />

        {credits && <Credits credits={credits} />}
        <Button onPress={() => signOut()}>
          <Text>Sign Out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
