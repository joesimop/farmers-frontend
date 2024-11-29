import React from "react";

// Define the props for the DescribeText component
interface DescribeTextProps {
  text: string; // The string to be formatted
  children?: React.ReactNode; // Optional child React node
}

const DescribeText: React.FC<DescribeTextProps> = ({ text, children }) => {
  return (
    <div>
      {children}
      <div className="text-xs italic text-gray-600">
        {text}
      </div>
    </div>
  );
};

export default DescribeText;