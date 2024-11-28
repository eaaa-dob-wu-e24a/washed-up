import { Api } from "api";
import { Machine } from "types";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Heading from "~/components/heading";

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
    <SafeAreaView className="p-6 h-screen justify-between">
      <View className="gap-4">
        <Heading title="Hello!" />
        <View>
          {machines?.map((machine) => (
            <Text key={machine.id}>{machine.model}</Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
