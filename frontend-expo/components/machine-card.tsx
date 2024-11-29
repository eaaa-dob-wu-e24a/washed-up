import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Machine } from "~/types";

export default function MachineCard({ data }: { data: Machine }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="capitalize">{data.type}</CardTitle>
        <CardDescription>Machine #{data.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <Text>Tuesday, 3 dec</Text>
        <Text>12:00 - 15:00</Text>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Text>Starts in: 12m 42s</Text>
        <Text>Status in: Occupied</Text>
      </CardFooter>
    </Card>
  );
}
