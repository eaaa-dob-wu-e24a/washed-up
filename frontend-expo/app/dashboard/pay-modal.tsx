import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";

export default function PayModal() {
  const [credits, setCredits] = useState<string>("");
  const price = Number(credits) * 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    const api = new Api(user?.publicMetadata.access_token);

    const result = await api.buyCredits({
      amount: Number(credits),
      price: price,
      currency: "DKK",
      payment_method: "card",
    });

    if (result === "success") {
      router.back();
    } else {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-6">
        <Heading
          title="Buy Credits"
          subtitle="Enter the number of credits you want to buy"
        />

        <View>
          <Label htmlFor="credits">Number of Credits</Label>
          <Input
            id="credits"
            keyboardType="numeric"
            placeholder="Enter amount"
            value={credits}
            onChangeText={setCredits}
          />
        </View>

        <View className="mt-6 mb-6">
          <Text weight={500}>Total Price</Text>
          <Text className="text-2xl">DKK {price.toFixed(2)}</Text>
        </View>

        {error && <Text className="text-red-500">{error}</Text>}

        <Button
          className="w-full mt-3"
          onPress={handlePayment}
          disabled={!credits || Number(credits) <= 0 || loading}
        >
          <Text>{loading ? "Loading..." : "Pay Now"}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
