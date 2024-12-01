import React from "react";

interface MSMFlexGridProps {
  children: React.ReactNode[];
  minColumns?: number;         // Minimum number of columns
  maxColumns?: number;         // Maximum number of columns
  horizontalSpacing?: number;  // Horizontal gap (Tailwind spacing scale)
  verticalSpacing?: number;    // Vertical gap (Tailwind spacing scale)
  className?: string;          // Additional classes
}

const MSMFlexGrid: React.FC<MSMFlexGridProps> = ({
  children,
  minColumns = 1,
  maxColumns = 3, // Default to 3 columns
  horizontalSpacing = 4, // Default horizontal gap
  verticalSpacing = 4, // Default vertical gap
  className = "",
}) => {
  // Dynamically calculate the number of columns for each breakpoint
  const interpolateColumns = (breakpointIndex: number) => {
    return Math.round(
      minColumns + ((maxColumns - minColumns) * breakpointIndex) / 3
    );
  };

  const breakpoints = {
    sm: interpolateColumns(1), // 1st of 4 breakpoints
    md: interpolateColumns(2), // 2nd of 4 breakpoints
    lg: interpolateColumns(3), // 3rd of 4 breakpoints
    xl: maxColumns,            // Always use maxColumns for the largest breakpoint
  };

  return (
    <div
      className={`
        grid 
        grid-cols-${minColumns} 
        sm:grid-cols-${breakpoints.sm} 
        md:grid-cols-${breakpoints.md} 
        lg:grid-cols-${breakpoints.lg} 
        xl:grid-cols-${breakpoints.xl}
        ${className}`}
      style={{
        columnGap: `${horizontalSpacing * 0.25}rem`, // Ensure minimum horizontal spacing
        rowGap: `${verticalSpacing * 0.25}rem`,     // Ensure minimum vertical spacing
      }}
    >
      {children.map((child, index) => (
        <div key={index} className="text-center">
          {child}
        </div>
      ))}
    </div>
  );
};

export default MSMFlexGrid;
