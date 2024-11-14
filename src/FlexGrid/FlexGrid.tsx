import React from 'react';
import { Grid2, Grid2Props } from '@mui/material';

interface FlexGridProps extends Grid2Props {
  /** An array of React nodes to display in the grid */
  children: React.ReactNode[];
  /** Number of columns in the grid */
  columns?: number;
  /** Spacing between grid items */
  spacing?: number;
  /** Additional props for individual grid items */
  itemProps?: Grid2Props;
}

const FlexGrid: React.FC<FlexGridProps> = ({
  children,
  ...gridProps
}) => {
  return (
    <Grid2 container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }} {...gridProps}>
      {React.Children.map(children, (child, index) => (
        <Grid2 key={index} size={{ xs: 2, sm: 4, md: 4 }}>
          {child}
        </Grid2>
      ))}
    </Grid2>
  );
};

export default FlexGrid;