import React, { useEffect, useRef } from 'react';
import './VendorManagement.css'; // External CSS for styling and animations
import Box from '@mui/material/Box';
import '../../index.css';
import TypedDataGrid from '@MSMComponents/TypedDataGrid/TypedDataGrid';
import PrimaryButton from '@MSMComponents/Buttons/PrimaryButton';
import CreateVendorForm from '@MSMComponents/Forms/CreateVendorFrom';
import { DisplayModal } from '@MSMComponents/Popups/PopupHelpers';
import { GetMarketsOptions, GetMarketVendors, MarketVendor } from './VendorManagmentAPICalls';
import { callEndpoint } from '../../lib/API/APIDefinitions';
import { DisplayAlert } from '@MSMComponents/Popups/PopupHelpers';
import MSMPage from '@MSMComponents/Layout/MSMPage';
import MSMEnumDropdown from '@MSMComponents/Inputs/MSMEnumDropdown';
import { VendorType } from '@lib/Constants/Types';
import MSMDropdown, { addNameForValuesForDropdown, convertToDropdownItems, MSMDropdownItem } from '@MSMComponents/Inputs/MSMDropdown';
import MSMForm, { MSMFormRef } from '@MSMComponents/Form Flow/MSMForm';
import MSMFormField from '@MSMComponents/Form Flow/MSMFormField';
import { z } from 'zod';
import MSMRow from '@MSMComponents/Layout/MSMRow';
import MSMHorizontalDivideLine from '@MSMComponents/Layout/MSMHorizontalDivideLine';

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
  const [marketOptions, setMarketOptions] = React.useState<MSMDropdownItem[]>([])

  const formRef = useRef<MSMFormRef>(null);

  const onModalConfirm = async () => {
    return await formRef.current?.submit()
  }

  const getVendors = (market_id: number) => {
    console.log(market_id)
    callEndpoint({
      endpointCall: GetMarketVendors(1, market_id),
      onSuccess: (data) => {
        setRows(mapAndDeduplicateVendors(data))
      },
      onError: (errorCode) => {
        DisplayAlert('error', "Could not retrieve vendors", errorCode)
      }
    });
  }

  useEffect(() => {
    callEndpoint({
      endpointCall: GetMarketsOptions(1),
      onSuccess: (data) => {
        setMarketOptions(convertToDropdownItems(data, "market", "market_id"))
      },
      onError: (errorCode) => {
        DisplayAlert('error', "Could not retrieve market options", errorCode)
      }
    });
  }, [])

  const ManagmentSchema = z.object({
    market: z.number()
  });

  return (



    <MSMPage title='Vendor Managment'>
      <MSMRow justify='end' align='end' lastElementRight>
        <MSMForm
          schema={ManagmentSchema}
          onSubmit={(data) => getVendors(data.market)}
          submitButtonText='Retrieve Vendors'
          row>
          {/* Market Selection */}
          <MSMFormField name="market" label="Market">
            {({ field }) => (
              <MSMDropdown
                items={marketOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          </MSMFormField>
        </MSMForm>

        <PrimaryButton
          text="Add Vendor"
          onClick={() => DisplayModal({ title: "Add Vendor", content: <CreateVendorForm ref={formRef} />, onConfirm: onModalConfirm })}
        />
      </MSMRow>
      <MSMHorizontalDivideLine />
      <Box sx={{ height: 400, width: '100%' }}>
        <TypedDataGrid data={rows} hiddenFields={[]} />
      </Box>

    </MSMPage>

  );
};

export default VendorManagement;