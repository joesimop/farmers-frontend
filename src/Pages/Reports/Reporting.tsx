import './Reporting.css'; // External CSS for styling and animations
import DropdownSelector from '../../Components/Inputs/DropdownSelector';
import {useState, useEffect, useCallback, useMemo} from 'react';
import dayjs from 'dayjs';
import { DisplayAlert } from '../../Components/Popups/PopupHelpers';
import "../../index.css";
import TypedDataGrid from '../../Components/TypedDataGrid/TypedDataGrid';
import Box from '@mui/material/Box';
import PrimaryButton from '../../Components/Buttons/PrimaryButton';
import MSMForm from '../../Components/Form Flow/MSMForm';
import FormSection from '../../Components/Form Flow/FormSection';
import { APIResult, callEndpoint, callEndpointWithState, DefaultApiResult } from '../../lib/API/APIDefinitions';

//API Calls and associated data types
import { GetReportingOptions, ReportingOption} from './ReportingAPICalls';
import { GetVendorReport, VendorReport } from './ReportingAPICalls';
import APIResultDisplay from '../../Components/APIResultDisplay';



const Reporting = () => {

  const [possibleMarketSelections, setPossibleMarketSelections] = useState<ReportingOption[]>([]);
  const [possibleMarkets, setPossibleMarkets] = useState<string[]>([]);
  const [possibleDates, setPossibleDates] = useState<string[]>([]);
  const [reportData, setReportData] = useState<APIResult<VendorReport[]>>(DefaultApiResult);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");


  const handleMarketSelectionChanged = (value: string) => {
    console.log("Market Selected: " + value); 
    setSelectedMarket(value);
  }

  const handleDateSelectionChanged = (value: string) => {
    console.log("Date Selected: " + value);
    setSelectedDate(value);
  }

  const getReports = () => {

    let marketID = possibleMarketSelections.find(
      (market: ReportingOption) => market.market_name === selectedMarket)?.market_id;
    
    callEndpointWithState({
      endpointCall: GetVendorReport(1, marketID === 0 ? undefined : marketID, selectedDate),
      setState: setReportData
    })
  }

  const getMarketOptions = useCallback( () => {  

    if(possibleMarketSelections.length === 0) { return []; }
    return possibleMarketSelections.map((market: ReportingOption) => market.market_name);

  }, [possibleMarketSelections]);

  const getDateOptions = useCallback((curMarket: string) => {  
    
    if(possibleMarketSelections.length === 0) { return []; }

    let marketIndex: number = possibleMarketSelections.findIndex((market: ReportingOption) => market.market_name === curMarket);
    if (marketIndex === -1) { return []; }
    
    let aggregatedDates: string[][] = [];
    if (marketIndex === 0) {

      possibleMarketSelections.forEach((market: ReportingOption, index: number) => {
        if(index === 0) { return; }
        aggregatedDates.push(market.market_dates);
      });
    }
    
    aggregatedDates.push(marketIndex > -1 ? possibleMarketSelections[marketIndex].market_dates : []);

    let flatDates: string[] = aggregatedDates.flat();
    flatDates.sort((a: string, b: string) => { return dayjs(a).isBefore(dayjs(b)) ? 1 : -1; });
    
    return flatDates;

  }, [possibleMarketSelections]);

  useEffect(() => {

    if(possibleMarketSelections.length === 0) { return; }
    setPossibleDates(getDateOptions(selectedMarket));

  }, [selectedMarket, possibleMarketSelections, getDateOptions]);

  useEffect(() => {

    if(possibleMarketSelections.length === 0) { return; }

    setSelectedMarket(possibleMarketSelections[0].market_name);
    setPossibleDates( getDateOptions(possibleMarketSelections[0].market_name));
    setPossibleMarkets( getMarketOptions());


  },[possibleMarketSelections, getMarketOptions, getDateOptions]);

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

  return (
    <div className='DefaultPageContainer' style={{display: "flex", flexDirection: "column"}}>
        <h1 style={{textAlign: 'left'}}>Reporting</h1>
    {/* MARKET SELECTION */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
      <div style={{minWidth: '30%'}}>
        <MSMForm>
          <FormSection sectionKey='ReportInputs' isNested>
            <div style={{display: 'flex', gap: '1em', flexDirection: 'row'}}>
        <DropdownSelector
            options={possibleMarkets}
                defaultValue={possibleMarketSelections.length > 0 ? possibleMarketSelections[0].market_name : ""}
            onChanged={handleMarketSelectionChanged}
            includeNone={true}
                formKey='Markets'
          />

        <DropdownSelector
            options={possibleDates}
                  defaultValue={possibleDates[0]}
            onChanged={handleDateSelectionChanged}
            includeNone={true}
                  formKey='Dates'
          />
          </div>
          </FormSection>
        </MSMForm>
        
      
      <PrimaryButton sx={{maxHeight: '3em', marginTop: '0.9em'}} text="Retrieve Reports" onClick={getReports}/>  
        <APIResultDisplay result={reportData}>
          {(data) => (
            <Box sx={{ flexGrow: 1 }}>
                <TypedDataGrid data={data} hiddenFields={["tokens"]} />
            </Box>
          )}
      </APIResultDisplay>
      </div>
    </div>
      </div>
    
  );
};

export default Reporting;