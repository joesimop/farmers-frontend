import { DataGrid } from '@mui/x-data-grid';

interface TypedDataGridProps<T> {
  data: T[]; // Array of data items of type T
  hiddenFields?: string[]; // Optional array of fields to hide
}

const TypedDataGrid = <T,>({ data, hiddenFields = [] }: TypedDataGridProps<T>) => {

    const columns =  data.length
    ? (Object.keys(data[0] as string[]) as Array<keyof T>)
        .filter((field) => !hiddenFields.includes(field.toString())) // Exclude fields in hiddenFields
        .map((field) => ({
          field: field as string,
          headerName: field.toString().charAt(0).toUpperCase() + field.toString().slice(1), // Format header name
          width: 150, // Default width
          flex: 1
        }))
    : [];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={data.map((item, index) => ({ ...item, id: index }))} // Add unique 'id' field for each row
        columns={columns}
        initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
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
