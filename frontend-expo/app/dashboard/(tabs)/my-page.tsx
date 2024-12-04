import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Credits as CreditsType, Location } from "~/types";
import Credits from "~/components/my-page/credits";
import Heading from "~/components/heading";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import UserInfo from "~/components/my-page/user-info";
import { Label } from "~/components/ui/label";
import Transactions from "~/components/my-page/transactions";

export default function MyPage() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [credits, setCredits] = useState<CreditsType | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function getData() {
    const api = new Api(user?.publicMetadata.access_token);
    const credits = await api.getCredits();
    const location = await api.getLocation();
    setCredits(credits);
    setLocation(location);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await getData();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    getData();
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

        <View className="flex gap-4">
          <Label>Account</Label>
          <UserInfo location={location} />

          <Label>Credits</Label>
          <Credits credits={credits} />

          <Label>Transactions</Label>
          <Transactions />
        </View>

        <Button
          className="mt-8"
          variant={"destructive"}
          onPress={() => signOut()}
        >
          <Text>Sign Out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
