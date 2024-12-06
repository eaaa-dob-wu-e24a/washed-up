import { View } from "react-native";
import { Text } from "../ui/text";
import { CreditPurchase, CreditUsage } from "~/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";
import { cn } from "~/lib/utils";

export default function Transactions({
  creditPurchases,
  creditUsages,
}: {
  creditPurchases: CreditPurchase[];
  creditUsages: CreditUsage[];
}) {
  const [tab, setTab] = useState<"usage" | "purchase">("usage");
  return (
    <View>
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "usage" | "purchase")}
        className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
      >
        <TabsList className="flex-row w-full mb-4">
          <TabsTrigger className="flex-1" value="usage">
            <Text>Usage</Text>
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="purchase">
            <Text>Purchase</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <UsageTransactions creditUsages={creditUsages} />
        </TabsContent>
        <TabsContent value="purchase">
          <PurchaseTransactions creditPurchases={creditPurchases} />
        </TabsContent>
      </Tabs>
    </View>
  );
}

function UsageTransactions({ creditUsages }: { creditUsages: CreditUsage[] }) {
  return (
    <View className="flex-col gap-3">
      {creditUsages.length === 0 && (
        <Text className="text-gray-500 text-sm mt-1 text-center">
          No usage transactions yet.
        </Text>
      )}
      {creditUsages.map((usage) => (
        <View key={usage.id} className="flex-col p-3 bg-gray-100 rounded-lg">
          <View className="flex-row justify-between mb-1">
            <Text className="font-medium">
              {usage.machine_type === "wash" ? "Washer" : "Dryer"} #
              {usage.machine_id}
            </Text>
            <Text
              className={cn(
                "text-red-600",
                usage.type === "refund" && "text-green-600"
              )}
            >
              {usage.type === "refund" ? "+" : "-"}
              {usage.cost_credits} credits
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">
              {usage.duration_minutes} minutes
            </Text>
            <Text className="text-gray-600">
              Balance: {usage.balance_after}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mt-1">
            {new Date(usage.created_at).toLocaleString(undefined, {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
        </View>
      ))}
    </View>
  );
}

function PurchaseTransactions({
  creditPurchases,
}: {
  creditPurchases: CreditPurchase[];
}) {
  return (
    <View className="flex-col gap-3">
      {creditPurchases.length === 0 && (
        <Text className="text-gray-500 text-sm mt-1 text-center">
          No purchase transactions yet.
        </Text>
      )}
      {creditPurchases.map((purchase) => (
        <View key={purchase.id} className="flex-col p-3 bg-gray-100 rounded-lg">
          <View className="flex-row justify-between mb-1">
            <Text className="font-medium flex-1">Credit Purchase</Text>
            <Text className="text-green-600 flex-1 text-right">
              +{purchase.credits_bought} credits
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 flex-1 capitalize">
              {purchase.payment_method}
            </Text>
            <Text className="text-gray-600 flex-1 text-right">
              Balance: {purchase.balance_after}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 text-sm mt-1 flex-1">
              {new Date(purchase.created_at).toLocaleString(undefined, {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Text>
            <Text className="text-gray-600 flex-1 text-right">
              {purchase.price} {purchase.currency}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
