import { Link } from "expo-router";
import { Modal, View } from "react-native";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Credits as CreditsType } from "~/types";
import { buttonVariants } from "../ui/button";
import { cn } from "~/lib/utils";

export default function Credits({ credits }: { credits: CreditsType }) {
  return (
    <>
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle>{credits.amount} Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Your credits will be used for booking.</Text>
        </CardContent>
        <CardFooter>
          <Link
            href="/dashboard/pay-modal"
            className={cn(buttonVariants(), "w-full")}
          >
            <Text className="text-white text-center">Buy Credits</Text>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
