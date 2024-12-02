import React from "react";

interface MSMMoneyDisplayProps {
  value: number; // The numeric value to display
  className?: string; // Optional Tailwind CSS classes
}

/**
 * MSMMoneyDisplay Component
 * Rounds the input value to two decimal places and displays it with a dollar sign.
 * Handles negative values by placing the negative sign before the dollar sign.
 */
const MSMMoneyDisplay: React.FC<MSMMoneyDisplayProps> = ({ value, className = "" }) => {
  // Determine if the value is negative
  const isNegative = value < 0;

  // Format the absolute value to two decimal places
  const formattedValue = Math.abs(value).toFixed(2);

  return (
    <span className={`${className}`}>
      {isNegative && "-"}${formattedValue}
    </span>
  );
};

export default MSMMoneyDisplay;