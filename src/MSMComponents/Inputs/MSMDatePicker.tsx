import React, { forwardRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@ShadcnComponents/ui/button";
import { Calendar } from "@ShadcnComponents/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@ShadcnComponents/ui/popover";

interface MSMSDatePickerProps {
  value?: Date | undefined;                     // Current value of the date
  onChange?: (date: Date | undefined) => void;  // Callback when date changes
  placeholder?: string;                         // Placeholder text
}

const MSMSDatePicker = forwardRef<HTMLDivElement, MSMSDatePickerProps>(
  ({ value, onChange, placeholder = "Pick a date", ...props }, ref) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        ref={ref}
        {...props}
        tabIndex={0}
      >
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={value}
              onSelect={(newDate) => {
                if (onChange) onChange(newDate || undefined); // Handle undefined if no date selected
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

MSMSDatePicker.displayName = "MSMSDatePicker";

export default MSMSDatePicker;
