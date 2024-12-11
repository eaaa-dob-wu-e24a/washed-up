import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Location } from "~/types";
import { useAuth } from "~/context/auth";

export default function UserInfo({ location }: { location: Location | null }) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Authenticated User</CardDescription>
        </CardHeader>
        <CardContent>
          <CardTitle>Location</CardTitle>
          <CardDescription>{location?.address}</CardDescription>
        </CardContent>
      </Card>
    </>
  );
}
