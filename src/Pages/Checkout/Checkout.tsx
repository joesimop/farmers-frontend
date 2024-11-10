import dayjs, { Dayjs } from "dayjs";
import DatePickerComponent from "../../Components/DatePicker/DatePicker";
import CheckoutNumericalEntry from "../../Components/CheckoutNumericalEntry/CheckoutNumericalEntry";
import SearchableDropdownSelector from "../../Components/SearchableDropdownSelector/SearchableDropdownSelector";
import DropdownSelector from "../../Components/DropdownSelector/DropdownSelector";
import {
  FieldControlModel,
  MarketCheckoutDataModel,
  MarketTokensModel,
  CheckoutModel,
  TokenSubmissionModel,
  MarketFeeModel,
  VendorModel,
} from "../../lib/Constants/DataModels";

import DataLabel from "../../Components/DataLabel/DataLabel";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DBResHandlers, 
  DB_GetVendorTokensFeesForMarket, 
  DB_SubmitCheckout, 
  DB_GetCheckoutInfoForManager 
} from "../../lib/API/APICalls";

import '../../index.css';
import FlexGrid from "../../FlexGrid/FlexGrid";

import { DisplaySuccessAlert, DisplayErrorAlert } from "../../Components/Popups/PopupHelpers";
import PrimaryButton from "../../Components/Buttons/PrimaryButton";

interface TokenTrackerModel {
  quantity: number;
  Token: MarketTokensModel;
}

const FIELD_LOC = { MARKET: 0, DATE: 1, VENDOR: 2, TOKENS: 3 }
const CheckoutFieldDefaults: FieldControlModel[] = [ 
  { fieldStatus: "active", input_label: "Market" },
  { fieldStatus: "active", input_label: "Market Date" },
  { fieldStatus: "disabled", input_label: "Vendor" },
  { fieldStatus: "disabled", input_label: "" },
];

const GrossProfitTokenModel: TokenTrackerModel = {
    quantity: 0,
    Token: { id: 1, type: "Gross Profit", per_dollar_value: 1 },
  }

const Checkout = () => {

  // State Variables
  const [fieldState, setFourmState] = useState<FieldControlModel[]>([...CheckoutFieldDefaults]);
  const [Markets, setMarkets] = useState<MarketCheckoutDataModel[]>([]);
  const [Vendors, setVendors] = useState<VendorModel[]>([]);
  const [Fees, setFees] = useState<MarketFeeModel[]>([]);
  const [Tokens, setTokens] = useState<TokenTrackerModel[]>([GrossProfitTokenModel]);
  const [selectedMarket, setSelectedMarket] = useState<MarketCheckoutDataModel>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorModel>();
  const [netVendorProfit, setNetVendorProfit] = useState<number>(0);
  const [marketFee, setMarketFee] = useState<number>(0);


////////////////////////////////
//    DB REQUEST HANDLERS     //
////////////////////////////////

  const OnMarketsRecieved = useMemo<DBResHandlers>(() => (
    {
    OnSuccess: (response: any) => {
      
      if (response === undefined || response.data === undefined) { return; }

      setMarkets([...response.data]);
      setSelectedMarket(response.data[0]);
      // console.log("MARKETS: ", response.data);

    },
    OnError: (error: any) => {}
  }),[]);

  const OnSubmissionAttempt = useMemo<DBResHandlers>(() => (
    {
      OnSuccess: (response: any) => {
        // console.log("STATUS: ", response);
        if (response !== undefined) {
          DisplaySuccessAlert("Data Sent Successfully", response.status);
          return;
        }
      },
      OnError: (error: any) => { DisplayErrorAlert("Failed To Send Data", error.status); 
      }
  }),[]);

  const OnVendorsAndTokensRecieved = useMemo<DBResHandlers>(() => ({

      OnSuccess: (response: any) => {

        //VALIDATE RESPONSE
        if (response === undefined || response.data === undefined) { return; }

        let data = response.data;
        // console.log("DATA: ", data);  

        // POPULATE VENDORS
        if (data.vendors !== undefined) {

          setVendors([...data.vendors]);

        } else {

          console.warn("NO VENDORS FOUND FOR: ", selectedMarket?.market_name);
          setVendors([]);

        }

        // POPULATE TOKENS
        if (data.tokens !== undefined && data.tokens !== null) {

          setTokens([GrossProfitTokenModel, 
            ...data.tokens.map((token: MarketTokensModel) => {return { quantity: 0, Token: token }})]);
          
        } else {

          console.warn("NO TOKENS FOUND FOR: ", selectedMarket?.market_name);
          setTokens([GrossProfitTokenModel]);

        }

        // POPULATE FEES
        if(data.fees !== undefined && data.fees !== null) { 
          setFees(data.fees);
        }
        else {
          console.warn("NO FEES FOUND FOR: ", selectedMarket?.market_name);
          setFees([]);
        }
      },

      OnError: (error: any) => {},

  }),[selectedMarket]);


////////////////////////////////
//       STATE HANDLERS       //
//////////////////////////////// 
  const handleMarketChanged = (value: string) => {

    setFourmState((prev) => {prev[FIELD_LOC.DATE].fieldStatus = "active"; return [...prev];});

    let newMarket: MarketCheckoutDataModel | undefined = Markets.find((market: MarketCheckoutDataModel) => market.market_name === value);
    setSelectedMarket(newMarket);

  };

  const handleDateChanged = (value: Dayjs | null) => {

    setFourmState((prev) => {prev[FIELD_LOC.VENDOR].fieldStatus = "active"; return [...prev];});
    setSelectedDate(value);

  };

  const handleVendorChanged = (value: string) => {

    setFourmState((prev) => {prev[FIELD_LOC.TOKENS].fieldStatus = "active"; return [...prev];});
    let selectedVendor: VendorModel | undefined = Vendors.find((vendor: VendorModel) => vendor.business_name === value);
    if(selectedVendor !== undefined) {
      setSelectedVendor(selectedVendor);
    }
  };

  const refreshMarketFee = useCallback( () => {
    setMarketFee((prev) => {

      let fee = Fees.find((fee: MarketFeeModel) => fee.vendor_type === selectedVendor?.type);
      // console.log("FEE: ", selectedVendor?.type, fee);  
      if(fee !== undefined) {

        let GP = Tokens[0].quantity; /* Gross Profit */
        switch(fee.fee_type) {
          case "PERCENT_GROSS":         return GP * fee.percent;
          case "FLAT_FEE":              return fee.flat;
          case "FLAT_PERCENT_COMBO":    return fee.flat + fee.percent * GP;
          case "MAX_OF_EITHER":         return fee.flat > fee.percent * GP ? fee.flat : fee.percent * GP;
          case "GOV_FEE":               return fee.flat

        }
      }

      console.warn("NO FEE FOUND FOR: ", selectedVendor?.type);
      return 0;

  });}, [Fees, Tokens, selectedVendor]);

  const handleTokensChanged = (newValue: number, fieldIndex: number) => {

    setNetVendorProfit((prev) => {
      
      let PDV = Tokens[fieldIndex].Token.per_dollar_value
      return fieldIndex > 0 ?
        prev + Tokens[fieldIndex].quantity * PDV - newValue * PDV :
        prev - Tokens[0].quantity + newValue;
      
    });

    setTokens((prev) => {prev[fieldIndex].quantity = newValue; return [...prev];});

    refreshMarketFee();
  };

  const submitCheckoutToDatabase = () => {
    //TODO: If Date is null, pass an empty string
    if (selectedMarket === undefined || selectedDate === null || selectedVendor === undefined) {
      console.warn("MISSING DATA");
      return;
    }

    console.log("SUBMITTING TOKENS", GenerateTokensForSubmission());
    // Builds the data sent to the db
    let Data: CheckoutModel = {
      market_vendor_id: selectedVendor?.market_vendor_id,
      market_date: selectedDate?.format("YYYY-MM-DD"),
      reported_gross: Tokens[0].quantity,
      fees_paid: netVendorProfit,
      tokens: GenerateTokensForSubmission(),
    };

    DB_SubmitCheckout(1, Data, OnSubmissionAttempt);
  };

////////////////////////////////
//        USE EFFECTS         //
////////////////////////////////

  // On First Load
  useEffect(() => { DB_GetCheckoutInfoForManager(1, OnMarketsRecieved); }, [OnMarketsRecieved]);

  // On Market Changed
  useEffect(() => {
    
    if (selectedMarket !== undefined && selectedMarket.market_id !== undefined) {
      DB_GetVendorTokensFeesForMarket(1, selectedMarket?.market_id, selectedDate?.format("YYYY-MM-DD"), OnVendorsAndTokensRecieved);
    }

  }, [selectedMarket, OnVendorsAndTokensRecieved, selectedDate]);

  // On Vendor Changed
  useEffect(() => {
   
    if (selectedVendor !== undefined) { refreshMarketFee(); }

  }, [selectedVendor, refreshMarketFee]);

////////////////////////////////
//     HELPER FUNCTIONS       //
//////////////////////////////// 

  /* 
    Distills the token data into the form needed for the API
    Namely: 
      (1) the token db id 
      (2) the quantity of the token
  */
      const GenerateTokensForSubmission: Function = (): any[] => {
        let tokensToSubmit: TokenSubmissionModel[] = [];
        Tokens.forEach((token: TokenTrackerModel, index: number) => {
          if (index !== 0) {
            tokensToSubmit.push({
              market_token_id: token.Token.id,
              count: token.quantity,
            }); }});

        return tokensToSubmit;
      };

  return (
    <div className="DefaultPageContainer">

      <h1 style={{textAlign:"left"}}>Checkout</h1>

      {/* MARKET SELECTION */}
      <DropdownSelector
        fieldState={fieldState[FIELD_LOC.MARKET]}
        options={Markets.map((market: MarketCheckoutDataModel) => market.market_name)}
        firstValue={Markets[0] ? Markets[0].market_name : ""}
        onChanged={handleMarketChanged}
      />

      {/* DATE SELECTION */}
      <DatePickerComponent
        initalDate={dayjs()}
        fieldState={fieldState[FIELD_LOC.DATE]}
        onDateChanged={handleDateChanged}
      />

      <hr className="solid" style={{marginBottom: "10px"}}/>

      {/* VENDOR SELECTION */}
      <SearchableDropdownSelector
        options={[...Vendors.map((vendor: VendorModel) => {return vendor.business_name})]}
        firstselected=""
        onSelect={handleVendorChanged}
        fieldState={fieldState[FIELD_LOC.VENDOR]}
      />

      {/* TOKENS */}
      <CheckoutNumericalEntry
        fields={[...Tokens.map((token: TokenTrackerModel) => token.Token)]}
        fieldState={fieldState[FIELD_LOC.TOKENS]}
        onChange={handleTokensChanged}
      />

      <FlexGrid items = 
        {[
          <DataLabel label="Market Fee" value={marketFee} />,
          <DataLabel label="Profit" value={netVendorProfit} />
        ]}
      />
      

    <PrimaryButton text="Submit To Database" onClick={submitCheckoutToDatabase} />

    </div>
  );

};

export default Checkout;
