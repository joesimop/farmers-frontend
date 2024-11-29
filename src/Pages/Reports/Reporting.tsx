import './Reporting.css'; // External CSS for styling and animations
import { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { DisplayAlert } from '@MSMComponents/Popups/PopupHelpers';
import "../../index.css";
import TypedDataGrid from '@MSMComponents/TypedDataGrid/TypedDataGrid';
import Box from '@mui/material/Box';
import PrimaryButton from '@MSMComponents/Buttons/PrimaryButton';
import MSMForm from '@MSMComponents/Form Flow/MSMForm';
import FormSection from '@MSMComponents/Form Flow/FormSection';
import { APIResult, callEndpoint, callEndpointWithState, DefaultApiResult } from '../../lib/API/APIDefinitions';

//API Calls and associated data types
import { GetReportingOptions, ReportingOption } from './ReportingAPICalls';
import { GetVendorReport, VendorReport } from './ReportingAPICalls';
import APIResultDisplay from '@MSMComponents/APIResultDisplay';
import MSMDropdown, { convertToDropdownItems } from '@MSMComponents/Inputs/MSMDropdown';
import MSMFormField from '@MSMComponents/Form Flow/MSMFormField';
import { z } from 'zod';
import MSMPage from '@MSMComponents/Layout/MSMPage';

function aggregateAllDates(markets: ReportingOption[]): string[] {
  const allDates = markets.flatMap((market) => market.market_dates);
  const uniqueDates = Array.from(new Set(allDates));
  return uniqueDates;
}

const Reporting = () => {

  const [possibleMarketSelections, setPossibleMarketSelections] = useState<ReportingOption[]>([]);
  const [possibleDates, setPossibleDates] = useState<string[]>([]);
  const [reportData, setReportData] = useState<APIResult<VendorReport[]>>(DefaultApiResult);


  const getReports = (marketId: number, date: string) => {
    callEndpointWithState({
      endpointCall: GetVendorReport(1, marketId, date),
      setState: setReportData
    })
  }

  const getMarketOptions = useCallback(() => {

    if (possibleMarketSelections.length === 0) { return []; }
    return possibleMarketSelections.map((market: ReportingOption) => market.market_name);

  }, [possibleMarketSelections]);

  const updateDateOptions = useCallback((marketId: number) => {

    if (marketId == 0) {
      setPossibleDates(aggregateAllDates(possibleMarketSelections))
      return;
    }

    let marketIndex: number = possibleMarketSelections.findIndex((market: ReportingOption) => market.market_id === marketId);
    if (marketIndex) {
      setPossibleDates(possibleMarketSelections[marketIndex].market_dates)
    }

  }, [possibleMarketSelections]);


  useEffect(() => {

    if (possibleMarketSelections.length === 0) { return; }
    updateDateOptions(possibleMarketSelections[0].market_id);

  }, [possibleMarketSelections, getMarketOptions, updateDateOptions]);

  useEffect(() => {
    const MarketManagerId = 1; // Replace with the actual MarketManager ID

    callEndpoint({
      endpointCall: GetReportingOptions(MarketManagerId),
      onSuccess: (data) => {
        setPossibleMarketSelections(data)
      },
      onError: (errorCode) => {
        DisplayAlert('error', "Could not complete get options", errorCode)
      },
    });
  }, []);

  const ReportingSchema = z.object({
    market: z.number(),
    date: z.string().min(1, "Date selection is required."),
  });

  return (
    <MSMPage title="Vendor Reports">
      <MSMForm schema={ReportingSchema} onSubmit={(data) => getReports(data.market, data.date)} row>


        {/* Market Selection */}
        <MSMFormField name="market" label="Market">
          {({ field }) => (
            <MSMDropdown
              items={convertToDropdownItems(possibleMarketSelections, "market_name", "market_id")}
              value={field.value}
              onChange={(marketId) => {
                field.onChange(marketId as number)
                updateDateOptions(marketId as number)
              }}
            />
          )}
        </MSMFormField>

        {/* Date Selection */}
        <MSMFormField name="date" label="Date">
          {({ field }) => (
            <MSMDropdown
              items={possibleDates}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        </MSMFormField>

      </MSMForm>
      <hr className='my-8 w-full' />
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