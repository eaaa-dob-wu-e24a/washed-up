import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useAuth } from "~/context/auth";
import { Location, User } from "~/types";
import { Text } from "../ui/text";

// UserInfo component that displays user profile information
// Takes location and user data as props
export default function UserInfo({
  location,
  user,
}: {
  location: Location | null;
  user: User[] | null;
}) {
  // Get authentication state from auth context
  const { isSignedIn } = useAuth();

  // Early return if user is not signed in
  if (!isSignedIn) {
    return null;
  }

  // Get the first user from the array (primary user)
  const primaryUser = user?.[0];
  // Helper function to format dates into localized string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <Text>Name: {primaryUser?.name}</Text>
          </CardDescription>
          <CardDescription>
            <Text className="capitalize">Role: {primaryUser?.role}</Text>
          </CardDescription>
          <CardDescription>
            <Text>Email: {primaryUser?.email}</Text>
          </CardDescription>
          <CardDescription>
            <Text>Location: {location?.address}</Text>
          </CardDescription>
          <CardDescription>
            <Text>
              Member since: {primaryUser && formatDate(primaryUser.created_at)}
            </Text>
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
}
