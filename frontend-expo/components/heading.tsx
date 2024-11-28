import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function Heading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-8">
      <Text className="text-3xl" weight={600}>
        {title}
      </Text>
      {subtitle && (
        <Text className="text-base text-foreground/60 pt-2">{subtitle}</Text>
      )}
    </View>
  );
}
