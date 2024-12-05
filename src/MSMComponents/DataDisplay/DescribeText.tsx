import React from "react";

// Define the props for the DescribeText component
interface DescribeTextProps {
  text: string; // The string to be formatted
  children?: React.ReactNode; // Optional child React node
  justifyCenter?: boolean; // Optional boolean to justify the text center
}

const DescribeText: React.FC<DescribeTextProps> = ({ text, children, justifyCenter }) => {
  return (
    <div className={(justifyCenter ? "flex flex-col items-center gap-y-2" : "") + " my-5"} >
      {children}
      <div className="text-xs italic text-gray-600">
        {text}
      </div>
    </div>
  );
};

export default DescribeText;