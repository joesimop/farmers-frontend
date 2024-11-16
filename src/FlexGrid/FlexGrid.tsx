import React from 'react';
import { Grid2, Grid2Props } from '@mui/material';

interface FlexGridProps extends Grid2Props {
  /** An array of React nodes to display in the grid */
  children: React.ReactNode[];
  /** Number of columns in the grid */
  maxColumns?: number;
  /** Spacing between grid items */
  spacing?: number;
  /** Additional props for individual grid items */
  itemProps?: Grid2Props;
}

const FlexGrid: React.FC<FlexGridProps> = ({
  children,
  maxColumns = 0, // Default to 12 columns
  spacing = 2, // Default spacing
  itemProps,
  ...gridProps
}) => {

  const limitColumns = maxColumns != 0;
  const itemSize = maxColumns / (Math.min(React.Children.count(children), maxColumns));

  return (
    <Grid2 container spacing={{ xs: 2, md: 4 }} justifyContent="flex-end"
           columns={limitColumns ? maxColumns : { xs: 4, sm: 8, md: 12 }} 
           {...gridProps}>
      {React.Children.map(children, (child, index) => (
        <Grid2 key={index} size={limitColumns ? itemSize : { xs: 2, sm: 4, md: 4 }}>
          {child}
        </Grid2>
      ))}
    </Grid2>
  );
};

export default FlexGrid;