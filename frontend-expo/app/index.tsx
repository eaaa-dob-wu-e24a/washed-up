import { Redirect } from "expo-router";
import { useAuth } from "~/context/auth";

export default function HomeScreen() {
  const { token } = useAuth();

  if (!token) {
    return <Redirect href={"/welcome"} />;
  } else {
    return <Redirect href={"/dashboard/(tabs)"} />;
  }
}
