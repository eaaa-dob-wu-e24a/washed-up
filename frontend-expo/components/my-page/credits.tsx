import { Text } from "~/components/ui/text";
import { Credits as CreditsType } from "~/types";

export default function Credits({ credits }: { credits: CreditsType }) {
  return <Text>{credits.id}</Text>;
}
