import React, { useEffect } from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField
} from "@ShadcnComponents/ui/form";
import { useFormContext, ControllerRenderProps, FieldValues } from "react-hook-form";

interface MSMFormFieldProps {
  name: string; // Field name
  label?: string; // Optional field label
  description?: string; // Optional field description
  children: (props: {
    field: ControllerRenderProps<FieldValues, string>; // Props to control the input
  }) => React.ReactNode; // Input component
}

const MSMFormField: React.FC<MSMFormFieldProps> = ({
  name,
  label,
  description,
  children,
}) => {
  
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{children({ field })}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default MSMFormField;
