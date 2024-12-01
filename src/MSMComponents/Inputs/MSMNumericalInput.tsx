import React, { forwardRef } from "react";
import { Input } from "@ShadcnComponents/ui/input";

interface MSMNumericalInputProps {
  value?: number;                   // Current value
  defaultValue?: number;            //
  onChange?: (value: number | undefined) => void; // Change handler
  placeholder?: string;             // Placeholder
  min?: number;                     // Minimum value
  max?: number;                     // Maximum value
  focusNext?: () => void;           // Function from form to change focus
}

const MSMNumericalInput = forwardRef<HTMLInputElement, MSMNumericalInputProps>(
  ({ value, defaultValue, onChange, placeholder = "Enter a number", min, max, focusNext, ...props }, ref) => {

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      // Allow clearing the input
      if (val === "") {
        onChange?.(undefined);
        return;
      }

      const numericValue = parseFloat(val.replace(/[^0-9.-]/g, ""));
      if (isNaN(numericValue)) return;

      // Ensure value is within min/max bounds
      if ((min !== undefined && numericValue < min) || (max !== undefined && numericValue > max)) {
        return;
      }

      onChange?.(numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && focusNext) {
        e.preventDefault(); // Prevent form submission on Enter
        focusNext();
      }
    };

    return (
      <Input
        ref={ref}
        value={value !== undefined ? value.toString() :
          defaultValue !== undefined ? defaultValue.toString() : ""
        }
        onChange={handleNumericChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type="number"
        {...props}
      />
    );
  }
);

MSMNumericalInput.displayName = "MSMNumericalInput";

export default MSMNumericalInput;
