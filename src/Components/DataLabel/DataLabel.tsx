import React from 'react';

interface DataLabelProps {
  /** The label text to display */
  label: string;
  /** The value associated with the label */
  value: React.ReactNode;
  /** Optional styles for the container */
  style?: React.CSSProperties;
}

/**
 * DataLabel Component
 * Displays a label followed by a colon and a value.
 * The space between the colon and the value adjusts based on the available space.
 */
const DataLabel: React.FC<DataLabelProps> = ({ label, value, style }) => {
  return (
    <div style={{ display: 'flex', maxWidth: "11em", color: "black", ...style }}>
      <span style={{ whiteSpace: 'nowrap' }}>
        {label}:
      </span>
      <span style={{ flexGrow: 1, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
};

export default DataLabel;