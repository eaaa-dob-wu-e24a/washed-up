import { View } from "react-native";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Machine } from "~/types";
import { Text } from "./ui/text";

export default function MachineCard({ data }: { data: Machine }) {
  return (
    <Card className="w-full">
      <View>
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
                data.status === 0 ? "text-green-500" : "text-red-500"
              }`}>
              {data.status === 0 ? "Free" : "Occupied"}
            </Text>
          </Text>
        </CardHeader>
      </View>
    </Card>
  );
}
