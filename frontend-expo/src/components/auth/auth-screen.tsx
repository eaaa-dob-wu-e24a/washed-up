import { Link } from "expo-router";
import { Text } from "react-native";

export default function AuthScreen() {
  return (
    <>
      <Link href="/sign-in">
        <Text>Sign In</Text>
      </Link>
      <Link href="/sign-up">
        <Text>Sign Up</Text>
      </Link>
    </>
  );
}
