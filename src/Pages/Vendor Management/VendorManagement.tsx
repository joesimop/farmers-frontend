import React from 'react';
import './VendorManagement.css'; // External CSS for styling and animations
import Box from '@mui/material/Box';
import TypedDataGrid from '../../Components/TypedDataGrid/TypedDataGrid';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import CreateVendorForm from '../../Components/Forms/CreateVendorFrom';
import { DisplayModal } from '../../Components/Popups/PopupHelpers';
import { GetMarketVendors, MarketVendor } from './VendorManagmentAPICalls';
import { callEndpoint } from '../../lib/API/APIDefinitions';
import { DisplayAlert } from '../../Components/Popups/PopupHelpers';

interface VendorTableRow {
  id: number;
  business_name: string;
}

// Function to map vendors to VendorTableRow and concatenate them while excluding duplicates
const mapAndDeduplicateVendors = (marketVendors: MarketVendor[]): VendorTableRow[] => {
  const vendorTableRows: VendorTableRow[] = [];
  
  marketVendors.forEach((marketVendor) => {
    marketVendor.vendors.forEach((vendor) => {
      // Check if the vendor is already in the list
      if (!vendorTableRows.some((row) => row.id === vendor.id)) {
        vendorTableRows.push({ id: vendor.id, business_name: vendor.business_name });
      }
    });
  });
  
  return vendorTableRows;
}

const VendorManagement = () => {

  const [rows, setRows] = React.useState<VendorTableRow[]>([]);

  const getVendors= () => {

    callEndpoint({
      endpointCall: GetMarketVendors(1),
      onSuccess: (data) => {
        setRows(mapAndDeduplicateVendors(data))
      },
      onError: (errorCode) => {
        DisplayAlert('error', "Could not retrieve vendors", errorCode)
      }
    });
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
        <TypedDataGrid data={rows} hiddenFields={[]} />
       </Box>
      </>

  );
};

export default VendorManagement;