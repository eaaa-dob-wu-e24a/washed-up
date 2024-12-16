import React from "react";
import { Link } from "expo-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { Credits as CreditsType } from "~/types";
import { buttonVariants } from "../ui/button";

export default function Credits({ credits }: { credits: CreditsType | null }) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{credits?.amount} Credits</CardTitle>
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
