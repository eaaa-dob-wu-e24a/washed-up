import { View } from "react-native";
import { Text } from "../ui/text";
import { CreditPurchase, CreditUsage } from "~/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useState } from "react";
import { cn } from "~/lib/utils";

const ITEMS_PER_PAGE = 10;

function PageControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row gap-2">
        <Text
          className={cn(
            "px-6 py-3 bg-secondary rounded-md",
            currentPage === 1 && "opacity-50"
          )}
          onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        >
          Previous
        </Text>
        <Text
          className={cn(
            "px-6 py-3 bg-secondary rounded-md",
            currentPage === totalPages && "opacity-50"
          )}
          onPress={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
        >
          Next
        </Text>
      </View>
      <Text className="text-secondary-foreground">
        Page {currentPage} of {totalPages}
      </Text>
    </View>
  );
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(creditUsages.length / ITEMS_PER_PAGE)
  );

  const paginatedUsages = creditUsages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <View className="flex-col gap-3">
      {creditUsages.length === 0 && (
        <Text className="text-secondary-foreground text-sm mt-1 text-center">
          No usage transactions yet.
        </Text>
      )}
      {creditUsages.length > 0 && (
        <PageControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {paginatedUsages.map((usage) => (
        <View key={usage.id} className="flex-col p-3 rounded-lg bg-secondary">
          <View className="flex-row justify-between mb-1">
            <Text className="font-semibold text-xl">
              {usage.machine_type === "wash" ? "Washer" : "Dryer"} #
              {usage.machine_id}
            </Text>
            <Text
              className={cn(
                "text-destructive",
                usage.type === "refund" && "text-primary"
              )}
            >
              {usage.type === "refund" ? "+" : "-"}
              {usage.cost_credits} credits
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-secondary-foreground">
              {usage.duration_minutes} minutes
            </Text>
            <Text className="text-secondary-foreground">
              Balance: {usage.balance_after}
            </Text>
          </View>
          <Text className="text-secondary-foreground text-sm mt-1">
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(creditPurchases.length / ITEMS_PER_PAGE)
  );

  const paginatedPurchases = creditPurchases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <View className="flex-col gap-3">
      {creditPurchases.length === 0 && (
        <Text className="text-secondary-foreground text-sm mt-1 text-center">
          No purchase transactions yet.
        </Text>
      )}
      {creditPurchases.length > 0 && (
        <PageControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {paginatedPurchases.map((purchase) => (
        <View
          key={purchase.id}
          className="flex-col p-3 rounded-lg bg-secondary"
        >
          <View className="flex-row justify-between mb-1">
            <Text className="font-medium flex-1">Credit Purchase</Text>
            <Text className="text-primary flex-1 text-right">
              +{purchase.credits_bought} credits
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-secondary-foreground flex-1 capitalize">
              {purchase.payment_method}
            </Text>
            <Text className="text-secondary-foreground flex-1 text-right">
              Balance: {purchase.balance_after}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-secondary-foreground text-sm mt-1 flex-1">
              {new Date(purchase.created_at).toLocaleString(undefined, {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Text>
            <Text className="text-secondary-foreground flex-1 text-right">
              {purchase.price} {purchase.currency}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
