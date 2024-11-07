import React from 'react';
import './VendorManagement.css'; // External CSS for styling and animations
import CustomButton from '../../Components/CustomButton/CustomButton';
import { DB_GetVendorsForMarketManger } from '../../lib/API/APICalls';
import { DBResHandlers } from '../../lib/API/APICalls';
import { DataGrid, GridColDef } from '@mui/x-data-grid/';
import Box from '@mui/material/Box';

const columns: GridColDef<(typeof tmpRows)>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
/*  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },*/
];

const tmpRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const VendorManagement = () => {

  // const [Vendors, setVendors] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<any[]>(tmpRows);

  const getVendors= () => {
    let mFunctions: DBResHandlers =
    {
        OnSuccess: (response: any, status: number) => {
            console.log("STATUS: " + status);
            console.log(response);
            let tmppRows=[{}];
            response.data.forEach((item: any) => {
              let newValue = {};
              item.vendors.forEach((vendor: any) => {
                newValue = {id: vendor.id, firstName: vendor.name}
                tmppRows.push(newValue);
              })
            }); 
            
            tmppRows.splice(0,1);
            console.log(tmppRows);
            setRows(tmppRows);

        },
        OnError: (response: any, status: number) => {
            console.error("STATUS: " + status);
        },
        OnFinally: () => {
            console.log("Finally");
        }
    };
    DB_GetVendorsForMarketManger(1, mFunctions);
  }
  return (
      <div>
        <p>Vendor Management</p>
        <CustomButton
        text="Get Vendors"
        color="#1E90FF"
        textColor="#fff"
        animate={false}
        onClick={getVendors}/>

      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
      </div>

  );
};

export default VendorManagement;