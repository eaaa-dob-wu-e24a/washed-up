import React from "react";
import { View } from "react-native";
import Heading from "~/components/heading";
import InputError from "~/components/input-error";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { SignUpFormErrors } from "~/types";

interface VerificationScreenProps {
  isLoading: boolean;
  code: string;
  errors: SignUpFormErrors;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
}

export function VerificationScreen({
  isLoading,
  code,
  errors,
  onCodeChange,
  onVerify,
}: VerificationScreenProps) {
  return (
    <>
      <View className="gap-4">
        <Heading
          title="Verify Email"
          subtitle="Enter the verification code sent to your email"
        />
        <View>
          <Label className="mb-2">Verification Code</Label>
          <Input
            value={code}
            placeholder="Code..."
            onChangeText={onCodeChange}
          />
          <InputError errors={errors} name="code" />
        </View>
      </View>
      <View>
        <Button size="high" onPress={onVerify} disabled={isLoading}>
          <Text>{isLoading ? "Loading..." : "Verify"}</Text>
        </Button>
      </View>
    </>
  );
}
