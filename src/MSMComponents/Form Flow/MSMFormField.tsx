import React, { useEffect } from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField
} from "@ShadcnComponents/ui/form";
import { useFormContext, ControllerRenderProps, FieldValues, UseFormSetFocus } from "react-hook-form";
import { useMSMFormContext } from "./MSMForm";

interface MSMFormFieldProps {
  name: string; // Field name
  label?: string; // Optional field label
  description?: string; // Optional field description
  children: (props: {
    field: ControllerRenderProps<FieldValues, string>; // Props to control the input
    focusNextField: () => void
  }) => React.ReactNode; // Input component
}

const MSMFormField: React.FC<MSMFormFieldProps> = ({
  name,
  label,
  description,
  children,
}) => {
  
  const { control, focusNextField } = useMSMFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{children({ field, focusNextField })}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default MSMFormField;
