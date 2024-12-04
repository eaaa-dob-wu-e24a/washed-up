import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  const { user } = useUser();

  if (!user) {
    return <Redirect href={"/welcome"} />;
  } else {
    return <Redirect href={"/dashboard/(tabs)"} />;
  }
}
