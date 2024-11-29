import React, { forwardRef } from "react";
import { Input } from "@ShadcnComponents/ui/input";

interface MSMTextInputProps {
  value?: string;                   // Current value
  onChange?: (value: string) => void; // Change handler
  placeholder?: string;             // Placeholder
  type?: string;                    // Input type (text, password, etc.)
  name?: string;                    // Field name (used for focus management)
  setFocusNext?: (currentField: string) => void; // Function to move focus
}

const MSMTextInput = forwardRef<HTMLInputElement, MSMTextInputProps>(
  ({ value, onChange, placeholder = "Enter text", type = "text", name, setFocusNext, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && name && setFocusNext) {
        e.preventDefault(); // Prevent form submission on Enter
        setFocusNext(name);
      }
    };

    return (
      <Input
        ref={ref}
        value={value || ""}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type={type}
        {...props}
      />
    );
  }
);

MSMTextInput.displayName = "MSMTextInput";

export default MSMTextInput;
