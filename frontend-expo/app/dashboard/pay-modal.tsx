import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useStripe } from "@stripe/stripe-react-native";

export default function PayModal() {
  const [credits, setCredits] = useState<string>("10");
  const price = Number(credits) * 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  async function initializePaymentSheet() {
    setLoading(true);
    setIsInitialized(false);
    try {
      const api = new Api(user?.publicMetadata.access_token);

      const data = await api.createPaymentIntent({
        amount: Number(credits) * 1000,
        currency: "DKK",
      });

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Your App Name",
        customerId: data.customer,
        customerEphemeralKeySecret: data.ephemeralKey,
        paymentIntentClientSecret: data.paymentIntent,
        allowsDelayedPaymentMethods: true,
      });

      if (error) {
        setError(error.message);
      } else {
        setLoading(false);
        setIsInitialized(true);
      }
    } catch (e) {
      setError("Failed to initialize payment sheet");
    }
    setLoading(false);
  }

  async function openPaymentSheet() {
    const { error } = await presentPaymentSheet();
    const api = new Api(user?.publicMetadata.access_token);

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      setError(error.message);
    } else {
      const result = await api.buyCredits({
        amount: Number(credits),
        price: price,
        currency: "DKK",
        payment_method: "card",
      });

      if (result === "success") {
        router.back();
      }
    }
  }

  // useEffect(() => {
  //   if (credits !== "" && Number(credits) > 0) {
  //     initializePaymentSheet();
  //   }
  // }, [credits]);

  async function handlePayment() {
    if (!credits || Number(credits) <= 0) return;
    // await openPaymentSheet();

    await initializePaymentSheet();
  }

  useEffect(() => {
    if (isInitialized) {
      openPaymentSheet();
    }
  }, [isInitialized]);

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
