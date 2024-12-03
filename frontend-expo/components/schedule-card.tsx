import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Schedule } from "~/types";

export default function ScheduleCard({ data }: { data: Schedule }) {
  return (
    <>
      <Card className="w-72 shadow shadow-slate-400">
        <CardHeader>
          <CardTitle>Washer</CardTitle>
          <CardDescription>Machine #13</CardDescription>
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
    </>
  );
}
