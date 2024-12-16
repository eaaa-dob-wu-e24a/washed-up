import React from "react";
import { ScrollView, View } from "react-native";
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
  isLoading: boolean;
}

export function UserInfoScreen({
  isLoading,
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
              placeholder="Your name..."
              className="placeholder:text-foreground"
              onChangeText={(value) => onUpdate("name", value)}
              maxLength={255} // Added maxLength based on validation
            />
            <InputError errors={errors} name="name" />
          </View>

          <View>
            <Label className="mb-2">Email Address</Label>
            <Input
              value={data.email}
              placeholder="your.email@example.com"
              className="placeholder:text-foreground"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => onUpdate("email", value)}
            />
            <InputError errors={errors} name="email" />
          </View>

          <View>
            <Label className="mb-2">Password</Label>
            <Input
              value={data.password}
              placeholder="Minimum 8 characters"
              className="placeholder:text-foreground"
              secureTextEntry
              onChangeText={(value) => onUpdate("password", value)}
            />
            <InputError errors={errors} name="password" />
          </View>

          <View>
            <Label className="mb-2">Confirm Password</Label>
            <Input
              value={data.c_password}
              placeholder="Re-enter password"
              className="placeholder:text-foreground"
              secureTextEntry
              onChangeText={(value) => onUpdate("c_password", value)}
            />
            <InputError errors={errors} name="c_password" />
          </View>

          <Button size="high" onPress={onNext} disabled={isLoading}>
            <Text>{isLoading ? "Loading..." : "Next step"}</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
