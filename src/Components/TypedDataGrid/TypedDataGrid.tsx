import React, { FC } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface TypedDataGridProps<T> {
  data: T[]; // Array of data items of type T
  hiddenFields?: string[]; // Optional array of fields to hide
}

const TypedDataGrid = <T,>({ data, hiddenFields = [] }: TypedDataGridProps<T>) => {
  // Generate columns by filtering out any fields that are included in hiddenFields
  const columns: GridColDef[] = data.length
    ? (Object.keys(data[0] as string[]) as Array<keyof T>)
        .filter((field) => !hiddenFields.includes(field.toString())) // Exclude fields in hiddenFields
        .map((field) => (console.log(field), {
          field: field as string,
          headerName: field.toString().charAt(0).toUpperCase() + field.toString().slice(1), // Format header name
          width: 150, // Default width
        }))
    : [];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data.map((item, index) => ({ ...item, id: index }))} // Add unique 'id' field for each row
        columns={columns}
        initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default TypedDataGrid;
