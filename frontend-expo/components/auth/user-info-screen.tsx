import { Keyboard, KeyboardAvoidingView, Platform, View } from "react-native";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Heading from "~/components/heading";
import InputError from "~/components/input-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { SignUpFormErrors, UserInfoFormData } from "~/types";

interface UserInfoScreenProps {
  data: UserInfoFormData;
  errors: SignUpFormErrors;
  onUpdate: (field: keyof UserInfoFormData, value: string) => void;
  onNext: () => void;
}

export function UserInfoScreen({
  data,
  errors,
  onUpdate,
  onNext,
}: UserInfoScreenProps) {
  return (
    <>
      <ScrollView>
        <View className="gap-4 pb-8">
          <Heading
            title="Create new account"
            subtitle="Start getting washed up!"
          />
          <View>
            <Label className="mb-2">Name</Label>
            <Input
              value={data.name}
              placeholder="Name..."
              onChangeText={(value) => onUpdate("name", value)}
            />
            <InputError errors={errors} name="name" />
          </View>

          <View>
            <Label className="mb-2">Email Address</Label>
            <Input
              value={data.emailAddress}
              placeholder="Email..."
              autoCapitalize="none"
              onChangeText={(value) => onUpdate("emailAddress", value)}
            />
            <InputError errors={errors} name="emailAddress" />
          </View>
          <View>
            <Label className="mb-2">Password</Label>
            <Input
              value={data.password}
              placeholder="Password..."
              secureTextEntry
              onChangeText={(value) => onUpdate("password", value)}
            />
            <InputError errors={errors} name="password" />
          </View>
          <View>
            <Label className="mb-2">Confirm Password</Label>
            <Input
              value={data.confirmPassword}
              placeholder="Confirm Password..."
              secureTextEntry
              onChangeText={(value) => onUpdate("confirmPassword", value)}
            />
            <InputError errors={errors} name="confirmPassword" />
          </View>
          <Button size="high" onPress={onNext}>
            <Text>Next step</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
