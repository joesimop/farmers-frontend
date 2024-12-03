import React from 'react';

interface DataLabelProps {
  label: string;
  value: React.ReactNode;
}

const DataLabel: React.FC<DataLabelProps> = ({ label, value }) => {
  return (
    <div className="w-full flex max-w-[11em] text-black">
      <span className="whitespace-nowrap flex-grow">
        {label}:
      </span>
      <span className="font-bold ml-2">
        {value}
      </span>
    </div>
  )
};

export default DataLabel;
