import { Machine } from "types";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Api } from "api";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const [machines, setMachines] = useState<Machine[]>([]);

  console.log("initial user", user);

  useEffect(() => {
    const token = user.publicMetadata.access_token;
    console.log(token);
    if (!token) return;
    const api = new Api(token);

    async function getData() {
      const data = await api.getMachines();
      setMachines(data);
    }
    getData();
  }, [isLoaded]);

  return (
    <View>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      {machines?.map((machine) => (
        <Text key={machine.id}>{machine.model}</Text>
      ))}
    </View>
  );
}
