import React, { forwardRef } from "react";
import { Input } from "@ShadcnComponents/ui/input";

interface MSMNumericalInputProps {
  value?: number;                   // Current value
  onChange?: (value: number) => void; // Change handler
  placeholder?: string;             // Placeholder
  min?: number;                     // Minimum value
  max?: number;                     // Maximum value
}

const MSMNumericalInput = forwardRef<HTMLInputElement, MSMNumericalInputProps>(
  ({ value, onChange, placeholder = "Enter a number", min, max, ...props }, ref) => {
    
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const numericValue = val === "" ? null : parseFloat(val.replace(/[^0-9.-]/g, ""));
      if (numericValue === null || isNaN(numericValue)) return;

      // Ensure value is within min/max bounds
      if ((min !== undefined && numericValue < min) || (max !== undefined && numericValue > max)) {
        return;
      }

      onChange?.(numericValue);
    };

    return (
      <Input
        ref={ref}
        value={value !== undefined ? value.toString() : ""}
        onChange={handleNumericChange}
        placeholder={placeholder}
        type="number"
        {...props}
      />
    );
  }
);

MSMNumericalInput.displayName = "MSMNumericalInput";

export default MSMNumericalInput;
