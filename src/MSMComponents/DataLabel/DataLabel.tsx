import React from 'react';

interface DataLabelProps {
  label: string;
  value: React.ReactNode;
}

const DataLabel: React.FC<DataLabelProps> = ({ label, value }) => {
  return (
    <div className={`w-full flex max-w-[11em] text-black`}>
      <span className="whitespace-nowrap flex-grow">
        {label}:
      </span>
      <span className="text-right">
        {value}
      </span>
    </div>
  );
};

export default DataLabel;
