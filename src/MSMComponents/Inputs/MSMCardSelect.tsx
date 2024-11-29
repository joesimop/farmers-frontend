import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@ShadcnComponents/ui/toggle-group";
import MSMFlexGrid from "@MSMComponents/Layout/MSMFlexGrid";

interface MSMCardSelectProps<T> {
  items: T[];                               // List of items to display
  onChange: (value: T) => void;             // Callback when selection changes
  renderCard: (item: T) => React.ReactNode; // Function to render the card content
  value?: T;                                // Currently selected value
}

const MSMCardSelect = <T,>({
  items,
  onChange,
  renderCard,
  value,
}: MSMCardSelectProps<T>) => {
    return (
        <ToggleGroup
          type="single"
          value={value ? JSON.stringify(value) : undefined}
          onValueChange={(val) => {
            const selectedItem = items.find((item) => JSON.stringify(item) === val);
            if (selectedItem) onChange(selectedItem);
          }}
        >
          <MSMFlexGrid>
            {items.map((item, index) => (
              <ToggleGroupItem
                key={index}
                value={JSON.stringify(item)}
                aria-label={`Select card ${index}`}
                className="data-[state=on]:bg-black data-[state=on]:text-white w-full outline outline-1"
              >
                {renderCard(item)}
              </ToggleGroupItem>
            ))}
          </MSMFlexGrid>
        </ToggleGroup>
      );
    };
    
    export default MSMCardSelect;
    
