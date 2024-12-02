import './Reporting.css'; // External CSS for styling and animations
import { useState, useEffect, useCallback } from 'react';
import { DisplayAlert } from '@MSMComponents/Popups/PopupHelpers';
import "../../index.css";
import TypedDataGrid from '@MSMComponents/TypedDataGrid/TypedDataGrid';
import Box from '@mui/material/Box';
import MSMForm from '@MSMComponents/Form Flow/MSMForm';
import MSMDropdown, { addNameForValuesForDropdown, convertToDropdownItems } from '@MSMComponents/Inputs/MSMDropdown';
import MSMFormField from '@MSMComponents/Form Flow/MSMFormField';
import { z } from 'zod';
import MSMPage from '@MSMComponents/Layout/MSMPage';
import { APIResult, callEndpoint, callEndpointWithState, DefaultApiResult } from '../../lib/API/APIDefinitions';
import { GetReportingOptions, ReportingOption } from './ReportingAPICalls';
import { GetVendorReport, VendorReport } from './ReportingAPICalls';
import APIResultDisplay from '@MSMComponents/APIResultDisplay';
import { toReadableDate } from 'Helpers';
import MSMHR from '@MSMComponents/Layout/MSMHorizontalDivideLine';
import MSMHorizontalDivideLine from '@MSMComponents/Layout/MSMHorizontalDivideLine';

function aggregateAllDates(markets: ReportingOption[]): string[] {
  const allDates = markets.flatMap((market) => market.market_dates);
  const uniqueDates = Array.from(new Set(allDates));
  return uniqueDates;
}

const Reporting = () => {

  const [possibleMarketSelections, setPossibleMarketSelections] = useState<ReportingOption[]>([]);
  const [possibleDates, setPossibleDates] = useState<string[]>([]);
  const [reportData, setReportData] = useState<APIResult<VendorReport[]>>(DefaultApiResult);


  // Function to fetch reporting options
  useEffect(() => {
    const MarketManagerId = 1; // Replace with the actual MarketManager ID
    callEndpoint({
      endpointCall: GetReportingOptions(MarketManagerId),
      onSuccess: (data) => setPossibleMarketSelections(data),
      onError: (errorCode) => DisplayAlert('error', "Could not complete get options", errorCode),
    });
  }, []);

  // Update date options when market changes
  const updateDateOptions = useCallback(
    (marketId: number) => {
      if (marketId === 0) {
        // Aggregate all dates for "All Markets"
        setPossibleDates(aggregateAllDates(possibleMarketSelections));
      } else {
        // Find dates for the selected market
        const selectedMarket = possibleMarketSelections.find((market) => market.market_id === marketId);
        setPossibleDates(selectedMarket?.market_dates || []);
      }
    },
    [possibleMarketSelections]
  );

  // Automatically set the default date options when markets load
  useEffect(() => {
    if (possibleMarketSelections.length > 0) {
      updateDateOptions(possibleMarketSelections[0].market_id);
    }
  }, [possibleMarketSelections, updateDateOptions]);

  const ReportingSchema = z.object({
    market: z.number(),
    date: z.string().min(1, "Date selection is required."),
  });

  const getReports = (marketId: number, date: string) => {
    const passedDate = date === "All Dates" ? "" : date
    callEndpointWithState({
      endpointCall: GetVendorReport(1, marketId, passedDate),
      setState: setReportData,
    });
  };

  return (
    <MSMPage title="Vendor Reports">
      <MSMForm
        schema={ReportingSchema}
        onSubmit={(data) => getReports(data.market, data.date)}
        submitButtonText='Retrieve Report'
        row>
        {/* Market Selection */}
        <MSMFormField name="market" label="Market">
          {({ field }) => (
            <MSMDropdown
              items={convertToDropdownItems(possibleMarketSelections, "market_name", "market_id")}
              value={field.value}
              onChange={(marketId) => {
                field.onChange(marketId as number);
                updateDateOptions(marketId as number);
              }}
            />
          )}
        </MSMFormField>

        {/* Date Selection */}
        <MSMFormField name="date" label="Date">
          {({ field }) => (
            <MSMDropdown
              items={
                [{ displayName: "All Dates", value: "All Dates" },
                ...addNameForValuesForDropdown(possibleDates, toReadableDate as (value: string | number) => string)
                ]}
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date..."
            />
          )}
        </MSMFormField>
      </MSMForm>
      <MSMHorizontalDivideLine />
      <APIResultDisplay result={reportData}>
        {(data) => (
          <Box sx={{ flexGrow: 1 }}>
            <TypedDataGrid data={data} hiddenFields={["tokens"]} />
          </Box>
        )}
      </APIResultDisplay>
    </MSMPage>
  );
};

export default Reporting;
