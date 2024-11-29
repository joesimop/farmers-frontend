import React, { forwardRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@ShadcnComponents/ui/button";
import { Calendar } from "@ShadcnComponents/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@ShadcnComponents/ui/popover";

interface MSMCalendarPickerProps {
  value?: Date | undefined;                     // Current value of the date
  onChange?: (date: Date | undefined) => void; // Callback when date changes
  placeholder?: string;                        // Placeholder text
}

const MSMCalendarPicker = forwardRef<HTMLDivElement, MSMCalendarPickerProps>(
  ({ value, onChange, placeholder = "Pick a date", ...props }, ref) => {

    return (
      <div ref={ref} {...props}>
        <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
        />
      </div>
    );
  }
);

MSMCalendarPicker.displayName = "MSMSDatePicker";

export default MSMCalendarPicker;
