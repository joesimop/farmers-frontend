import { forwardRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@ShadcnComponents/ui/select";

interface MSMDropdownItem {
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
      value: typeof value === "number" ? value : String(value), // Explicitly handle 0 and other numbers
    };
  });
}

type MSMDropdownProps = {
  items: MSMDropdownItem[] | (string | number)[]; // Handle both dropdown items and single values
  placeholder?: string;                          // Placeholder text
  value?: string | number | null;                // Current value
  onChange?: (value: string | number) => void;   // Change handler
};

/**
 * Utility function to normalize the dropdown items. Converts a list of
 * single values or tuples into MSMDropdownItem format.
 */
function normalizeItems(
  items: MSMDropdownItem[] | (string | number)[]
): MSMDropdownItem[] {
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
  ({ items, placeholder = "Select an option...", value, onChange, ...props }, ref) => {

    // Normalize the items to ensure uniform structure
    const normalizedItems = normalizeItems(items);

    return (
      <div ref={ref} {...props} className="z-50">
        <Select
          // Ensure value remains `string | number` and handle undefined properly
          value={value !== undefined && value !== null ? String(value) : undefined}
          onValueChange={(selectedValue) => {
            if (onChange) {
              // Find the selected item and pass its original value (string or number)
              const selectedItem = normalizedItems.find(
                (item) => String(item.value) === selectedValue
              );
              onChange(selectedItem ? selectedItem.value : selectedValue);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder}>
              {normalizedItems.find((item) => String(item.value) === String(value))?.displayName ||
                null}
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
