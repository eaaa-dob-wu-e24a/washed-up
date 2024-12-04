import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Credits as CreditsType } from "~/types";
import Credits from "~/components/my-page/credits";

export default function MyPage() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [credits, setCredits] = useState<CreditsType | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    async function fetchCredits() {
      const api = new Api(user?.publicMetadata.access_token);
      const credits = await api.getCredits();
      setCredits(credits);
    }
    fetchCredits();
  }, [user]);

  if (!user) {
    return <Redirect href={"/"} />;
  }

  console.log(credits);

  return (
    <SafeAreaView className="p-6 h-screen justify-between">
      <View>
        {credits && <Credits credits={credits} />}
        <Button onPress={() => signOut()}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
