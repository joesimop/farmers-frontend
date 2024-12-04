import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@ShadcnComponents/ui/toggle-group";
import MSMFlexGrid from "@MSMComponents/Layout/MSMFlexGrid";

interface MSMMultiCardSelectProps<T> {
    items: T[];                               // List of items to display
    onChange: (values: T[]) => void;          // Callback when selection changes
    renderCard: (item: T) => React.ReactNode; // Function to render the card content
    values?: T[];                             // Currently selected values
}

const MSMMultiCardSelect = <T,>({
    items,
    onChange,
    renderCard,
    values = [],
}: MSMMultiCardSelectProps<T>) => {
    return (
        <ToggleGroup
            type="multiple"
            value={values.map((val) => JSON.stringify(val))}
            onValueChange={(selectedValues) => {
                const selectedItems = items.filter((item) =>
                    selectedValues.includes(JSON.stringify(item))
                );
                onChange(selectedItems);
            }}
        >
            <MSMFlexGrid>
                {items.map((item, index) => (
                    <ToggleGroupItem
                        key={index}
                        value={JSON.stringify(item)}
                        aria-label={`Select card ${index}`}
                        className="data-[state=on]:bg-primary data-[state=on]:text-white w-full outline outline-1"
                    >
                        {renderCard(item)}
                    </ToggleGroupItem>
                ))}
            </MSMFlexGrid>
        </ToggleGroup>
    );
};

export default MSMMultiCardSelect;
