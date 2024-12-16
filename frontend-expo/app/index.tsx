import { Redirect } from "expo-router";
import { useAuth } from "~/context/auth";

export default function HomeScreen() {
  const { token } = useAuth();

  // Returnerer enten velkomstskærm eller dashboard, alt efter om brugeren er logget ind
  if (!token) {
    return <Redirect href={"/welcome"} />;
  } else {
    return <Redirect href={"/dashboard/(tabs)"} />;
  }
}
