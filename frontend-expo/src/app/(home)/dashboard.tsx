import { Api } from "@/api";
import { Machine } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Dashboard() {
  const { user } = useUser();
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    const token = user?.publicMetadata?.access_token;
    if (!token) return;
    const api = new Api(token);

    async function getData() {
      const data = await api.getMachines();
      setMachines(data);
    }
    getData();
  }, [user]);

  return (
    <View>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      {machines?.map((machine) => (
        <Text key={machine.id}>{machine.model}</Text>
      ))}
    </View>
  );
}
