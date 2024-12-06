import { Link } from "expo-router";
import { View } from "react-native";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Machine } from "~/types";

export default function MachineCard({ data }: { data: Machine }) {
  return (
    <>
      <Link href={`/dashboard/booking-modal/${data.id}`}>
        <Card className="w-full shadow shadow-slate-400 ios:shadow-black/5">
          <CardHeader className="flex-row justify-between">
            <View>
              <CardTitle className="capitalize">
                {data.type === "wash"
                  ? "Washer"
                  : data.type === "dry"
                  ? "Dryer"
                  : data.type}
              </CardTitle>
              <CardDescription>#{data.id}</CardDescription>
            </View>
            <Text className="text-2xl mt-1">
              <Text
                className={`text-2xl mt-1 ${
                  data.status === 1 ? "text-primary" : "text-destructive"
                }`}
              >
                {data.status === 1 ? "Available" : "Disabled"}
              </Text>
            </Text>
          </CardHeader>
        </Card>
      </Link>
    </>
  );
}
