import { forwardRef, useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@ShadcnComponents/ui/select";

export interface MSMDropdownItem {
  displayName: string;          // Label displayed in the dropdown
  value: string | number;       // Value associated with the displayName
}

export function convertToDropdownItems<T>(
  objects: T[],
  displayNameKey: keyof T,
  valueKey: keyof T
): MSMDropdownItem[] {
  return objects.map((obj) => {
    const value = obj[valueKey];
    return {
      displayName: String(obj[displayNameKey]),
      value: typeof value === "number" ? value : String(value),
    };
  });
}

export function addNameForValuesForDropdown(
  values: (string | number)[],
  nameMapper: (value: string | number) => string
): MSMDropdownItem[] {
  return values.map((value) => ({
    displayName: nameMapper(value),
    value: value,
  }));
}

type MSMDropdownProps = {
  items: MSMDropdownItem[] | (string | number)[]; // Handle both dropdown items and single values
  defaultSelect?: string | number;
  placeholder?: string;                          // Placeholder text
  value?: string | number | null;                // Current value
  onChange?: (value: string | number | undefined) => void;   // Change handler
  focusNext?: () => void                          // Moves focus to next field
};

/**
 * Utility function to normalize the dropdown items. Converts a list of
 * single values or tuples into MSMDropdownItem format.
 */
function normalizeItems(items: MSMDropdownItem[] | (string | number)[]): MSMDropdownItem[] {
  if (items.length === 0) return [];

  // If the items are already in MSMDropdownItem format
  if (typeof items[0] === "object" && "displayName" in (items[0] as any)) {
    return items as MSMDropdownItem[];
  }

  // If items are a list of single values (strings or numbers)
  return (items as (string | number)[]).map((item) => ({

    displayName: String(item),
    value: item,
  }));
}

const MSMDropdown = forwardRef<HTMLDivElement, MSMDropdownProps>(
  ({ items, defaultSelect, placeholder, value, onChange, focusNext, ...props }, ref) => {

    const [internalValue, setInternalValue] = useState<string | number | undefined>(value || undefined);
    const normalizedItems = normalizeItems(items);

    // Automatically set the first item as the value if the items array changes
    useEffect(() => {
      if (normalizedItems.length > 0) {
        // If internalValue is not in the current items, reset to the first item
        const currentItemExists = normalizedItems.some((item) => String(item.value) === String(internalValue));
        if (!currentItemExists) {
          const firstItemValue = normalizedItems[0].value;
          setInternalValue(firstItemValue);
          onChange?.(firstItemValue); // Notify parent of the change
        }
      } else if (internalValue !== undefined) {
        // If there are no items, clear the internal value
        setInternalValue(undefined);
        onChange?.(undefined);
      }
    }, [normalizedItems, internalValue, onChange]);

    return (
      <div ref={ref} {...props}>
        <Select
          value={internalValue !== undefined ? internalValue.toString() : undefined}
          onValueChange={(selectedValue) => {
            const selectedItem = normalizedItems.find(
              (item) => String(item.value) === selectedValue
            );
            const newValue = selectedItem ? selectedItem.value : selectedValue;
            setInternalValue(newValue);
            if (onChange) {
              onChange(newValue);
            }
            if (focusNext) {
              focusNext()
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder}>
              {normalizedItems.find((item) => String(item.value) === String(internalValue))
                ?.displayName || null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {normalizedItems.map((item) => (
              <SelectItem key={String(item.value)} value={String(item.value)}>
                {item.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

MSMDropdown.displayName = "MSMDropdown";

export default MSMDropdown;