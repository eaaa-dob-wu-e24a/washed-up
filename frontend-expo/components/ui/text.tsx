import * as Slot from "@rn-primitives/slot";
import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import * as React from "react";
import { Text as RNText } from "react-native";
import { cn } from "~/lib/utils";

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextWeight = 400 | 500 | 600 | 700;

interface TextProps extends SlottableTextProps {
  weight?: TextWeight;
}

const Text = React.forwardRef<TextRef, TextProps>(
  ({ className, asChild = false, weight = 400, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    const fontFamily = React.useMemo(() => {
      switch (weight) {
        case 400:
          return "Poppins_400Regular";
        case 500:
          return "Poppins_500Medium";
        case 600:
          return "Poppins_600SemiBold";
        case 700:
          return "Poppins_700Bold";
        default:
          return "Poppins_400Regular";
      }
    }, [weight]);

    return (
      <Component
        style={{ fontFamily }}
        className={cn(
          "text-base text-foreground web:select-text",
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, TextClassContext };
export type { TextWeight };
