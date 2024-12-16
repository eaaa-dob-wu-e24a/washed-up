import { useStripe } from "@stripe/stripe-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import { useAuth } from "~/context/auth"; // Import custom auth hook
import Heading from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Location } from "~/types";

export default function PayModal() {
  // State management for payment flow
  const [credits, setCredits] = useState<string>("10"); // Number of credits to purchase
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState<string | null>(null); // Error handling
  const [isInitialized, setIsInitialized] = useState(false); // Payment sheet initialization state
  const [location, setLocation] = useState<Location | null>(null); // User's location details

  // Calculate total price based on credits and location price
  const price = Number(credits) * Number(location?.price_per_credit);

  // Hooks for authentication, navigation and Stripe
  const { token } = useAuth();
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  /**
   * Initializes the Stripe payment sheet with customer and payment details
   */
  async function initializePaymentSheet() {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setIsInitialized(false);
    try {
      const api = new Api(token);

      // Create payment intent with Stripe
      const data = await api.createPaymentIntent({
        amount: Number(credits) * Number(location?.price_per_credit) * 100, // Convert to cents
        currency: location?.currency || "DKK",
      });

      // Configure payment sheet with Stripe credentials
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Washed Up",
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

  /**
   * Presents the payment sheet and processes the payment
   */
  async function openPaymentSheet() {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    const { error } = await presentPaymentSheet();
    const api = new Api(token);

    if (error) {
      setError(error.message);
    } else {
      // Process credit purchase after successful payment
      const result = await api.buyCredits({
        amount: Number(credits),
        price: price,
        currency: location?.currency || "DKK",
        payment_method: "card",
      });

      if (result === "success") {
        router.back();
      }
    }
  }

  /**
   * Handles the initial payment flow
   */
  async function handlePayment() {
    if (!credits || Number(credits) <= 0) return;
    await initializePaymentSheet();
  }

  // Open payment sheet when initialization is complete
  useEffect(() => {
    if (isInitialized) {
      openPaymentSheet();
    }
  }, [isInitialized]);

  // Fetch location details on component mount
  useEffect(() => {
    async function fetchLocation() {
      const api = new Api(token);
      const location = await api.getLocation();
      setLocation(location);
    }
    fetchLocation();
  }, [token]);

  // UI Render
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-6">
        {/* Header Section */}
        <Heading
          title="Buy Credits"
          subtitle="Enter the number of credits you want to buy"
        />

        {/* Credit Input Section */}
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

        {/* Price Display Section */}
        <View className="mt-6 mb-6">
          <Text weight={500}>Total Price</Text>
          {isNaN(price) ? (
            <Text className="text-2xl">Loading...</Text>
          ) : (
            <Text className="text-2xl">
              {location?.currency} {price.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Error Display */}
        {error && <Text className="text-destructive">{error}</Text>}

        {/* Payment Button */}
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
