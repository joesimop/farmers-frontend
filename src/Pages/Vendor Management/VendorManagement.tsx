import React from 'react';
import './VendorManagement.css'; // External CSS for styling and animations
import { DB_GetVendorsForMarketManger } from '../../lib/API/APICalls';
import { DBResHandlers } from '../../lib/API/APICalls';
import Box from '@mui/material/Box';
import TypedDataGrid from '../../Components/TypedDataGrid/TypedDataGrid';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import CreateVendorForm from '../../Components/Forms/CreateVendorFrom';
import { DisplayModal } from '../../Components/Popups/PopupHelpers';

interface TempVendorModel {
  id: number;
  firstName: string;
}

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

  const [rows, setRows] = React.useState<any[]>(tmpRows);

  const getVendors= () => {
    let mFunctions: DBResHandlers =
    {
        OnSuccess: (response: any, status: number) => {
            console.log("STATUS: " + status);
            console.log(response);
            let tmppRows=[{}];
            response.data.forEach((item: any) => {
              item.vendors.forEach((vendor: any) => {
                let newValue = {id: vendor.id, firstName: vendor.name}
                tmppRows.push(newValue);
              })
            }); 
            
            tmppRows.splice(0,1);
            setRows(tmppRows);

        },
        OnError: (response: any, status: number) => {
            console.error("STATUS: " + status);
        }
    };
    DB_GetVendorsForMarketManger(1, mFunctions);
  }
  return (
      <>
        <p>Vendor Management</p>


         <PrimaryButton text="Get Vendors" onClick={getVendors}/>
         <PrimaryButton
            text="Add Vendor"
            onClick={ () => DisplayModal(<CreateVendorForm onSubmit={() => console.log("Submitted!")}/>
            , ()=> {}, ()=> {}, "Submit")}
             />

      <Box sx={{ height: 400, width: '100%' }}>
        <TypedDataGrid<TempVendorModel> data={rows} hiddenFields={[]} />
       </Box>
      </>

  );
};

export default VendorManagement;