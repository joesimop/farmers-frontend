import React, { forwardRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@ShadcnComponents/ui/select";

interface MSMEnumDropdownProps<T extends Record<string, string>> {
  enumObject: T;                      // The Enum object to generate options
  value: T[keyof T];                  // Current selected value
  onChange: (value: T[keyof T]) => void; // Change handler
  placeholder?: string;               // Placeholder text
}

const MSMEnumDropdown = forwardRef<HTMLDivElement, MSMEnumDropdownProps<any>>(
  <T extends Record<string, string>>(
    { enumObject, value, onChange, placeholder = "Select an option...", ...props }: MSMEnumDropdownProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    // Ensure enumValues has the correct type
    const enumValues = Object.values(enumObject) as T[keyof T][];

    return (
      <div ref={ref} {...props}>
        <Select
          value={value} // Directly use the enum value
          onValueChange={(val) => onChange(val as T[keyof T])} // Cast value to the correct type
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder}>
              {value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-50">
            {enumValues.map((enumValue) => (
              <SelectItem key={enumValue} value={enumValue}>
                {enumValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

MSMEnumDropdown.displayName = "MSMEnumDropdown";

export default MSMEnumDropdown;
