import { Text } from "./ui/text";

export default function InputError({
  errors,
  name,
}: {
  errors: { [key: string]: string };
  name: string;
}) {
  if (!errors?.[name]) return null;

  return <Text className="text-destructive mt-2">{errors[name]}</Text>;
}
