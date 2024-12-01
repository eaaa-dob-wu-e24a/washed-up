import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Machine } from "~/types";

export default function MachineCard({ data }: { data: Machine }) {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Card className="w-full">
            <CardHeader className="flex-row justify-between">
              <View>
                <CardTitle className="capitalize">
                  {data.type === "wash"
                    ? "Washer"
                    : data.type === "dry"
                    ? "Dryer"
                    : data.type}
                </CardTitle>
                <CardDescription>#{data.id}</CardDescription>
              </View>
              <Text className="text-2xl mt-1">
                <Text
                  className={`text-2xl mt-1 ${
                    data.status === 0 ? "text-primary" : "text-destructive"
                  }`}>
                  {data.status === 0 ? "Available" : "In use"}
                </Text>
              </Text>
            </CardHeader>
          </Card>
        </DialogTrigger>
        {/* This is the dialog box */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
            <DialogDescription>
              This is machine #{data.id} and it is a {data.type} machine.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>
                <Text>OK</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
