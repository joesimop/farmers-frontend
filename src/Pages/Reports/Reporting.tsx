import './Reporting.css'; // External CSS for styling and animations
import React from 'react';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { DB_GetReportingOptions, DB_GetReports,  DBResHandlers} from '../../lib/API/APICalls';
import DropdownSelector from '../../Components/DropdownSelector/DropdownSelector';
import {useState, useEffect, useCallback} from 'react';
import dayjs from 'dayjs';
import { ReportModel } from '../../lib/Constants/DataModels';
import { DisplayAlert } from '../../Components/Popups/PopupHelpers';
// import { DataGrid, GridColDef } from '@mui/x-data-grid/';
import TypedDataGrid from '../../Components/TypedDataGrid/TypedDataGrid';
import Box from '@mui/material/Box';

// const columns: GridColDef<ReportModel>[] = [
//   { field: 'id', headerName: 'ID', width: 90 },
//   {
//     field: 'market_date',
//     headerName: 'Market Date',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'business_name',
//     headerName: 'Busniess',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'fees_paid',
//     headerName: 'Market Fee',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'gross',
//     headerName: 'Gross Profit',
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'tokens',
//     headerName: 'First name',
//     width: 150,
//     editable: true,
//   }
// ];

interface MarketSelectorModel {
  market_name: string;
  market_id: number;
  market_dates: string[];
}

const Reporting = () => {

  const [possibleMarketSelections, setPossibleMarketSelections] = useState<MarketSelectorModel[]>([]);
  const [possibleMarkets, setPossibleMarkets] = useState<string[]>([]);
  const [possibleDates, setPossibleDates] = useState<string[]>([]);
  const [reportData, setReportData] = useState<ReportModel[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  let getReportingOptionsHandlers: DBResHandlers =
  {
      OnSuccess: (response: any, status: number) => {
          console.log("STATUS: " + status);
          console.log(response);
          DisplayAlert('success', "Successfully retrieved report options", status);
          setPossibleMarketSelections(response.data);
      },
      OnError: (response: any, status: number) => {
          console.error("STATUS: " + status);
          DisplayAlert('success', "Error retrieving report options", status);
      },
      OnFinally: () => {
          console.log("Finally");
      }
  };

  let getReportHandlers: DBResHandlers =
  {
      OnSuccess: (response: any, status: number) => {
          console.log("STATUS: " + status);
          console.log(response);
          DisplayAlert('success', "Successfully retrieved report options", status);
          setReportData(response.data);
      },
      OnError: (response: any, status: number) => {
          console.error("STATUS: " + status);
          DisplayAlert('success', "Error retrieving report options", status);

      },
      OnFinally: () => {
          console.log("Finally");
      }
  };

  const handleMarketSelectionChanged = (value: string) => {
    console.log("Market Selected: " + value); 
    setSelectedMarket(value);
  }

  const handleDateSelectionChanged = (value: string) => {
    console.log("Date Selected: " + value);
    setSelectedDate(value);
  }

  const getReportOptions= () => {

    DB_GetReportingOptions(1, getReportingOptionsHandlers);
  }

  const getReports = () => {

    let marketID = possibleMarketSelections.find(
      (market: MarketSelectorModel) => market.market_name === selectedMarket)?.market_id;

    DB_GetReports(1, marketID === 0 ? undefined : marketID, selectedDate, getReportHandlers);

  }

  const getMarketOptions = useCallback( () => {  

    if(possibleMarketSelections.length === 0) {
      return [];
    }
    return possibleMarketSelections.map((market: MarketSelectorModel) => market.market_name);
  }, [possibleMarketSelections]);

  const getDateOptions = useCallback((curMarket: string) => {  
    if(possibleMarketSelections.length === 0) {
      return [];
    }

    let marketIndex: number = possibleMarketSelections.findIndex((market: MarketSelectorModel) => market.market_name === curMarket);
    let aggregatedDates: string[][] = [];

    if (marketIndex === -1) {
      return [];
    }
    else if (marketIndex === 0) {

      possibleMarketSelections.forEach((market: MarketSelectorModel, index: number) => {
        if(index === 0) {
          return;
        }
        aggregatedDates.push(market.market_dates);
      });

      console.log("AGGREGATED DATES" + aggregatedDates.flat());
    }
    console.log("Market Index: " + marketIndex);

    console.log(possibleMarketSelections[marketIndex].market_dates);
    aggregatedDates.push(marketIndex > -1 ? possibleMarketSelections[marketIndex].market_dates : []);

    let flatDates: string[] = aggregatedDates.flat();
    flatDates.sort((a: string, b: string) => { return dayjs(a).isBefore(dayjs(b)) ? 1 : -1; });
    
    return flatDates;

  }, [possibleMarketSelections]);

  useEffect(() => {
    console.log("AHHHHHHHH");
    if(possibleMarketSelections.length === 0) {
      return;
    }

    setPossibleDates(getDateOptions(selectedMarket));
  }, [selectedMarket, possibleMarketSelections, getDateOptions]);

  useEffect(() => {

    if(possibleMarketSelections.length === 0) {
      return;
    }

    setSelectedMarket(possibleMarketSelections[0].market_name);
    setPossibleDates( getDateOptions(possibleMarketSelections[0].market_name));
    setPossibleMarkets( getMarketOptions());

    
  },[possibleMarketSelections, getMarketOptions, getDateOptions]);

  return (
    <div>
    <h1>Reporting</h1>
    <CustomButton
        text="Get Report Options"
        color="#1E90FF"
        textColor="#fff"
        animate={false}
        onClick={getReportOptions}/>

      {/* MARKET SELECTION */}
    <DropdownSelector
        fieldState={{fieldStatus: "active",
          input_label: "Markets"}}
        options={possibleMarkets}
        firstValue={possibleMarketSelections.length > 0 ? possibleMarketSelections[0].market_name : ""}
        onChanged={handleMarketSelectionChanged}
        includeNone={true}
      />

          {/* Date SELECTION */}
    <DropdownSelector
    fieldState={{fieldStatus: "active",
      input_label: "Dates"}}
        options={possibleDates}
        firstValue={possibleDates[0]}
        onChanged={handleDateSelectionChanged}
        includeNone={true}
      />

    <CustomButton
        text="Retrieve Reports"
        color="#1E90FF"
        textColor="#fff"
        animate={false}
        onClick={getReports}/>


      <TypedDataGrid<ReportModel> data={reportData} hiddenFields={["tokens"]}/>

    </div>

    

    
  );
};

export default Reporting;