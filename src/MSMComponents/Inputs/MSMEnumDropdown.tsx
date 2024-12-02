import React, { forwardRef, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@ShadcnComponents/ui/select";
import { toReadableString } from "Helpers";



export interface MSMEnumDropdownItem<T> {
  displayName: string;
  value: T;
}

//Generates a displayName, Value pair for each key and sorts alphabetically
export function convertToEnumDropdownItems<T extends Record<string, string>>(
  enumObject: T
): MSMEnumDropdownItem<T[keyof T]>[] {
  const enumValues = Object.values(enumObject) as T[keyof T][];
  return enumValues
    .map((value) => ({
      displayName: toReadableString(value),
      value: value,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}


interface MSMEnumDropdownProps<T extends Record<string, string>> {
  enumObject: T;                           // The Enum object to generate options
  value?: T[keyof T];                      // Current selected value
  onChange?: (value: T[keyof T]) => void;  // Change handler
  placeholder?: string;                    // Placeholder text
}

const MSMEnumDropdown = forwardRef<HTMLDivElement, MSMEnumDropdownProps<any>>(
  <T extends Record<string, string>>(
    { enumObject, value, onChange, placeholder = "Select an option...", ...props }: MSMEnumDropdownProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {

    const [internalValue, setInternalValue] = useState<MSMEnumDropdownItem<T[keyof T]> | undefined>()
    const enumValues = convertToEnumDropdownItems(enumObject);

    return (
      <div ref={ref} {...props}>
        <Select
          value={internalValue !== undefined ? internalValue.toString() : undefined}
          onValueChange={(selectedValue) => {
            const selectedItem = enumValues.find(
              (item) => String(item.value) === selectedValue
            );
            if (selectedItem) {
              setInternalValue(selectedItem);
              onChange?.(selectedItem.value);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder}>
              {internalValue?.displayName || placeholder}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {enumValues.map((enumValue) => (
              <SelectItem key={enumValue.value} value={enumValue.value.toString()}>
                {enumValue.displayName}
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
