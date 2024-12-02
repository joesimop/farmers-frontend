import React, { useEffect } from 'react';
import './VendorManagement.css'; // External CSS for styling and animations
import Box from '@mui/material/Box';
import '../../index.css';
import TypedDataGrid from '@MSMComponents/TypedDataGrid/TypedDataGrid';
import PrimaryButton from '@MSMComponents/Buttons/PrimaryButton';
import CreateVendorForm from '@MSMComponents/Forms/CreateVendorFrom';
import { DisplayModal } from '@MSMComponents/Popups/PopupHelpers';
import { GetMarketVendors, MarketVendor } from './VendorManagmentAPICalls';
import { callEndpoint } from '../../lib/API/APIDefinitions';
import { DisplayAlert } from '@MSMComponents/Popups/PopupHelpers';
import MSMPage from '@MSMComponents/Layout/MSMPage';
import { DataTable } from '@MSMComponents/DataTable/DataTable';

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

  const getVendors = () => {

    callEndpoint({
      endpointCall: GetMarketVendors(1),
      onSuccess: (data) => {
        console.log("VM DATA: ", data)
        setRows(mapAndDeduplicateVendors(data))
      },
      onError: (errorCode) => {
        DisplayAlert('error', "Could not retrieve vendors", errorCode)
      }
    });
  }

  useEffect(() => {
    getVendors();
  }, []);

  return (
    <MSMPage title='Vendor Managment'>


      <PrimaryButton text="Get Vendors" onClick={getVendors} />
      <PrimaryButton
        text="Add Vendor"
        onClick={() => DisplayModal({content:<CreateVendorForm />, title: "Add Vendor"})}
      />

      <Box sx={{ height: 400, width: '100%' }}>
        <TypedDataGrid data={rows} hiddenFields={[]} />
        <DataTable data={rows} columns={}/>
      </Box>
    </MSMPage>

  );
};

export default VendorManagement;