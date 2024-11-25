import { View } from "react-native";
import { Text } from "./ui/text";

export default function Heading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="p-6">
      <Text className="text-3xl font-bold">{title}</Text>
      {subtitle && <Text className="text-lg text-gray-500">{subtitle}</Text>}
    </View>
  );
}
