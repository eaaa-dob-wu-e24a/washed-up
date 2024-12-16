import React from "react";
import { Redirect, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Api } from "~/api";
import Heading from "~/components/heading";
import Credits from "~/components/my-page/credits";
import Transactions from "~/components/my-page/transactions";
import UserInfo from "~/components/my-page/user-info";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth";
import { useNotification } from "~/context/notification-context";
import {
  CreditPurchase,
  Credits as CreditsType,
  CreditUsage,
  Location,
  User,
} from "~/types";

// MyPage component - Displays user account information, credits, and transaction history
// with pull-to-refresh functionality and loading states
export default function MyPage() {
  // Authentication context
  const { token, signOut } = useAuth();

  // State management for user data
  const [credits, setCredits] = useState<CreditsType | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [creditPurchases, setCreditPurchases] = useState<CreditPurchase[]>([]);
  const [creditUsages, setCreditUsages] = useState<CreditUsage[]>([]);
  const [user, setUser] = useState<User[] | null>(null);

  // UI state management
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all user-related data from API
  async function getData() {
    const api = new Api(token);
    const credits = await api.getCredits();
    const location = await api.getLocation();
    const creditPurchases = await api.getCreditPurchases();
    const creditUsages = await api.getCreditUsages();
    const user = await api.getUser();

    // Update state with fetched data
    setUser(user);
    setCredits(credits);
    setLocation(location);
    setCreditPurchases(creditPurchases);
    setCreditUsages(creditUsages);
  }

  // Handle pull-to-refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);

  // Initial data fetch on component mount
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    };
    fetchData();
  }, [token]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      const fetchData = async () => {
        setLoading(true);
        await getData();
        setLoading(false);
      };
      fetchData();
    }, [token])
  );

  // Get push notification token for sign out
  const { expoPushToken } = useNotification();

  // Redirect to home if not authenticated
  if (!token) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
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
          {loading ? (
            <>
              <Skeleton className="rounded-lg w-full h-12" />
              <Skeleton className="rounded-lg w-full h-12" />
            </>
          ) : (
            <UserInfo location={location} user={user} />
          )}

          <Label>Credits</Label>
          {loading ? (
            <Skeleton className="rounded-lg w-full h-32" />
          ) : (
            <Credits credits={credits} />
          )}

          <Label>Transactions</Label>
          {loading ? (
            <View className="h-screen">
              <Skeleton className="rounded-lg w-full h-16" />
              <Skeleton className="rounded-lg w-full h-16 mt-4" />
              <Skeleton className="rounded-lg w-full h-16 mt-4" />
              <Skeleton className="rounded-lg w-full h-16 mt-4" />
            </View>
          ) : (
            <Transactions
              creditPurchases={creditPurchases}
              creditUsages={creditUsages}
            />
          )}
        </View>

        <Button
          className="my-16"
          variant={"destructive"}
          onPress={async () => {
            if (expoPushToken) {
              const api = new Api(token);
              await api.removeToken(expoPushToken);
            }
            signOut();
          }}
        >
          <Text>Sign Out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
