import { Link } from "expo-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import { Location } from "~/types";
import { useUser } from "@clerk/clerk-expo";

export default function UserInfo({ location }: { location: Location | null }) {
  const { user } = useUser();
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{user?.publicMetadata?.name as string}</CardTitle>
          <CardDescription>
            {user?.emailAddresses[0].emailAddress}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Text>{location?.address}</Text>
        </CardContent>
      </Card>
    </>
  );
}
