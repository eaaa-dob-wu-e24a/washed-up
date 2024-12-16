import React from "react";
import { StripeProvider as StripeProviderNative } from "@stripe/stripe-react-native";

export default function StripeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StripeProviderNative
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    >
      <>{children}</>
    </StripeProviderNative>
  );
}
