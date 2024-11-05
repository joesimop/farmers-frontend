import './Reporting.css'; // External CSS for styling and animations
import CustomButton from '../../Components/CustomButton/CustomButton';
import {DBResHandlers } from '../../lib/API/APICalls';
import { DB_GetReportingOptions } from '../../lib/API/APICalls';
import DropdownSelector from '../../Components/DropdownSelector/DropdownSelector';
import {useState, useEffect, useCallback} from 'react';

interface MarketSelectorModel {
  market_name: string;
  market_id: number;
  market_dates: string[];
}

const Reporting = () => {
  const [possibleMarketSelections, setPossibleMarketSelections] = useState<MarketSelectorModel[]>([]);
  const [possibleMarkets, setPossibleMarkets] = useState<string[]>([]);
  const [possibleDates, setPossibleDates] = useState<string[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>("");



  const handleMarketSelectionChanged = (value: string) => {
    console.log("Market Selected: " + value);
    let selectedMarket: MarketSelectorModel | undefined = possibleMarketSelections.find((market: MarketSelectorModel) => market.market_name === value);
    if(selectedMarket !== undefined) {
      setSelectedMarket(selectedMarket.market_name);
    }
  }

  const getReportOptions= () => {
    let mFunctions: DBResHandlers =
    {
        OnSuccess: (response: any, status: number) => {
            console.log("STATUS: " + status);
            console.log(response);
            setPossibleMarketSelections(response.data);
        },
        OnError: (response: any, status: number) => {
            console.error("STATUS: " + status);
        },
        OnFinally: () => {
            console.log("Finally");
        }
    };
    DB_GetReportingOptions(1, mFunctions);
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
    console.log("Market Index: " + marketIndex);

    console.log(possibleMarketSelections[marketIndex].market_dates);
    return marketIndex > -1 ? possibleMarketSelections[marketIndex].market_dates : [];
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
      />

          {/* Date SELECTION */}
    <DropdownSelector
    fieldState={{fieldStatus: "active",
      input_label: "Dates"}}
        options={possibleDates}
        firstValue={possibleDates[0]}
        onChanged={() => {}}
      />

<CustomButton
        text="Retrieve Reports"
        color="#1E90FF"
        textColor="#fff"
        animate={false}
        onClick={getReportOptions}/>
    </div>

    
  );
};

export default Reporting;