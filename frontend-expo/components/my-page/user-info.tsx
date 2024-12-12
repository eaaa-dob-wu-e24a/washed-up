import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Location, User } from "~/types";
import { useAuth } from "~/context/auth";
import { View } from "react-native";
import { Text } from "../ui/text";

export default function UserInfo({
  location,
  user,
}: {
  location: Location | null;
  user: User[] | null;
}) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  const primaryUser = user?.[0];
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
