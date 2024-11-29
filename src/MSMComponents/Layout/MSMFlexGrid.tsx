import React from "react";

interface MSMFlexGridProps {
  children: React.ReactNode[];
  minColumns?: number           //Minimum number of columns
  maxColumns?: number; // Maximum number of columns
  horizontalSpacing?: number; // Horizontal gap (Tailwind spacing scale)
  verticalSpacing?: number; // Vertical gap (Tailwind spacing scale)
  className?: string; // Additional classes
}

const MSMFlexGrid: React.FC<MSMFlexGridProps> = ({
  children,
  minColumns = 1,
  maxColumns = 3, // Default to 3 columns
  horizontalSpacing = 4, // Default horizontal gap
  verticalSpacing = 4, // Default vertical gap
  className = "",
}) => {
  return (
    <div
      className={`
        grid 
        grid-cols-${minColumns} sm:grid-cols-2 md:grid-cols-${maxColumns} lg: grid-cols-${maxColumns}
        gap-x-${horizontalSpacing} gap-y-${verticalSpacing}
        ${className}`}
      style={{
        columnGap: `${horizontalSpacing * 0.25}rem`, // Ensure minimum horizontal spacing
        rowGap: `${verticalSpacing * 0.25}rem`,     // Ensure minimum vertical spacing
      }}
    >
      {children.map((child, index) => (
        <div key={index} className="flex items-center justify-center">
          {child}
        </div>
      ))}
    </div>
  );
};

export default MSMFlexGrid;
