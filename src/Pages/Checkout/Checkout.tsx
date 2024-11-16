import dayjs, { Dayjs } from "dayjs";
import MSMDatePicker from "../../Components/Inputs/DatePicker";
import SearchableDropdownSelector from "../../Components/Inputs/SearchableDropdownSelector";
import DropdownSelector from "../../Components/Inputs/DropdownSelector";
import TokenInput from "../../Components/Inputs/TokenInput";
import {
  MarketCheckoutDataModel,
  MarketTokensModel,
  CheckoutModel,
  TokenSubmissionModel,
  MarketFeeModel,
  VendorModel,
} from "../../lib/Constants/DataModels";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DBResHandlers, 
  DB_GetVendorTokensFeesForMarket, 
  DB_SubmitCheckout, 
  DB_GetCheckoutInfoForManager 
} from "../../lib/API/APICalls";

import {
  processMarketsResponse,
  processVendorsAndTokensResponse,
  processSubmissionResponse,
  TokenFieldModel, GrossProfitTokenModel
} from "./CheckoutDataValidation";

import '../../index.css';
import DataLabel from "../../Components/DataLabel/DataLabel";
import FlexGrid from "../../FlexGrid/FlexGrid";
import MSMForm from "../../Components/Form Flow/MSMForm";
import FormSection from "../../Components/Form Flow/FormSection";
import { resetMSMFormSections } from "../../Components/Form Flow/MSMFormStateFunctions";

import { DisplaySuccessAlert, DisplayErrorAlert } from "../../Components/Popups/PopupHelpers";
import { FeeType } from "../../lib/Constants/Types";
import { capitalizeFirstLetter } from "../../Helpers";
import DescribeText from "../../Components/DescribeText";


const Checkout = () => {

  // State Variables
  const [Markets, setMarkets] = useState<MarketCheckoutDataModel[]>([]);
  const [Vendors, setVendors] = useState<VendorModel[]>([]);
  const [Fees, setFees] = useState<MarketFeeModel[]>([]);
  const [Tokens, setTokens] = useState<TokenFieldModel[]>([GrossProfitTokenModel]);
  const [selectedMarket, setSelectedMarket] = useState<MarketCheckoutDataModel>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorModel>();
  const [netVendorProfit, setNetVendorProfit] = useState<number>(0);
  const [marketFee, setMarketFee] = useState<number>(0);
  const [marketFeeModel, setMarketFeeModel] = useState<MarketFeeModel | null>(null);


////////////////////////////////
//       STATE HANDLERS       //
//////////////////////////////// 
  const handleMarketChanged = (value: string) => {

    let newMarket: MarketCheckoutDataModel | undefined = Markets.find((market: MarketCheckoutDataModel) => market.market_name === value);
    setSelectedMarket(newMarket);
    resetMSMFormSections();
    
  };

  const handleDateChanged = (value: Dayjs | null) => { setSelectedDate(value); };

  const handleVendorChanged = (value: string) => {

    let selectedVendor: VendorModel | undefined = Vendors.find((vendor: VendorModel) => vendor.business_name === value);
    if(selectedVendor !== undefined) {
      setSelectedVendor(selectedVendor);
    }
  };

  const calculateMarketFee = useCallback(() => {

      if (!marketFeeModel) {
        setMarketFee(0);
        return;
      }

      let calculatedFee = 0;

      let GP = Tokens[0].quantity; /* Gross Profit */
      switch(marketFeeModel.fee_type) {
        case FeeType.PERCENT_GROSS:         calculatedFee = GP * marketFeeModel.percent; break;
        case FeeType.FLAT_FEE:              calculatedFee =  marketFeeModel.flat; break;
        case FeeType.FLAT_PERCENT_COMBO:    calculatedFee = marketFeeModel.flat + marketFeeModel.percent * GP; break;
        case FeeType.MAX_OF_EITHER:         calculatedFee = marketFeeModel.flat > marketFeeModel.percent * GP ? marketFeeModel.flat : marketFeeModel.percent * GP; break;
        case FeeType.GOV_FEE:               calculatedFee = marketFeeModel.flat

      }
      

      setMarketFee(calculatedFee);
    }, [marketFeeModel, Tokens]); /* Fees, Tokens, selectedVendor */

    // Generate the string explaining the market fee calculation
    const getMarketFeeCalculationString = (): string => {
      
      if(!(Fees && Fees.length > 0)){
        return "No vendor fees found for this market"
      }

      if (!marketFeeModel) {
        if(selectedVendor){
          return `No fee found for ${capitalizeFirstLetter(selectedVendor.type)}`;
        }
        return "No fees applicable."
      }

      const GP = Tokens[0].quantity; // Gross Profit

      switch (marketFeeModel.fee_type) {
        case FeeType.PERCENT_GROSS:
          return `Percent Gross: ${marketFeeModel.percent * 100}% of Gross Profit (${GP} * ${marketFeeModel.percent} = ${marketFee})`;

        case FeeType.FLAT_FEE:
          return `Flat Fee: $${marketFee}`;

        case FeeType.FLAT_PERCENT_COMBO:
          return `Flat + Percent: $${marketFeeModel.flat} + (${GP} * ${marketFeeModel.percent} = ${marketFeeModel.percent * GP})`;

        case FeeType.MAX_OF_EITHER:
          const percentFee = marketFeeModel.percent * GP;
          return `Max of Either: $${marketFeeModel.flat} or (${GP} * ${marketFeeModel.percent} = ${percentFee})`;

        case FeeType.GOV_FEE:
          return `Government Fee: $${marketFee}`;

        default:
          return "Unknown fee type";
      }
    };

  const handleTokensChanged = (newValue: number, fieldIndex: number) => {

    setNetVendorProfit((prev) => {
      
      let PDV = Tokens[fieldIndex].Token.per_dollar_value
      return fieldIndex > 0 ?
        prev + Tokens[fieldIndex].quantity * PDV - newValue * PDV :
        prev - Tokens[0].quantity + newValue;
      
    });

    setTokens((prev) => {prev[fieldIndex].quantity = newValue; return [...prev];});

    calculateMarketFee();
  };

    // Update the market fee model when the vendor changes
    useEffect(() => {
      const fee = Fees.find((fee: MarketFeeModel) => fee.vendor_type === selectedVendor?.type);
      setMarketFeeModel(fee || null);
    }, [selectedVendor, Fees]);
  
    // Recalculate the market fee when the model or tokens change
    useEffect(() => {
      calculateMarketFee();
    }, [marketFeeModel, Tokens]);

  const submitCheckoutToDatabase = () => {
    // TODO: If Date is null, pass an empty string
    if (selectedMarket === undefined || selectedDate === null || selectedVendor === undefined) {
      DisplayErrorAlert("Must fill all fields before submitting checkout")
      return;
    }

    // Builds the data sent to the db
    let Data: CheckoutModel = {
      market_vendor_id: selectedVendor?.market_vendor_id,
      market_date: selectedDate?.format("YYYY-MM-DD"),
      reported_gross: Tokens[0].quantity,
      fees_paid: netVendorProfit,
      tokens: GenerateTokensForSubmission(),
    };

    //Submit Checkout
    DB_SubmitCheckout(1, Data, {
      OnSuccess: (response: any) => {
        const message = processSubmissionResponse(response);
        DisplaySuccessAlert(message, response.status);
      },
      OnError: (error: any) => {
        DisplayErrorAlert("Failed To Send Data", error.status);
      },
    });
  };


////////////////////////////////
//        USE EFFECTS         //
////////////////////////////////

  // On First Load
  useEffect(() => {
    DB_GetCheckoutInfoForManager(1, {
      OnSuccess: (response: any) => {
        const markets = processMarketsResponse(response);
        setMarkets(markets);
        setSelectedMarket(markets[0]);
      },
      OnError: (error: any) => {},
    });
  }, []);

  // On Market or Date Changed
  useEffect(() => {
    if (selectedMarket !== undefined && selectedDate !== null) {
      DB_GetVendorTokensFeesForMarket(1, selectedMarket?.market_id, selectedDate?.format("YYYY-MM-DD"),
        {
          OnSuccess: (response: any) => {
            const { vendors, tokens, fees } = processVendorsAndTokensResponse( response, selectedMarket?.market_name);
            setVendors(vendors);
            setTokens(tokens);
            setFees(fees);
          },
          OnError: (error: any) => {},
        }
      );
    }
  }, [selectedMarket, selectedDate]);


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
        Tokens.forEach((token: TokenFieldModel, index: number) => {
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

      <MSMForm isAuto>
        <FormSection sectionKey="CheckoutOptions">

           {/* MARKET SELECTION */}
          <DropdownSelector
            options={Markets.map((market: MarketCheckoutDataModel) => market.market_name)}
            defaultValue={Markets[0] ? Markets[0].market_name : ""}
            onChanged={handleMarketChanged}
            formKey={"Market"}
          />
          
          {/* DATE SELECTION */}
          <MSMDatePicker
            initalDate={dayjs()}
            onDateChanged={handleDateChanged}
            formKey={"Date"}
          />

        </FormSection>

        <FormSection sectionKey="VendorSelection" disableOnReset>

          {/* VENDOR SELECTION */}
          <SearchableDropdownSelector
            options={[...Vendors.map((vendor: VendorModel) => {return vendor.business_name})]}
            firstselected=""
            onSelect={handleVendorChanged}
            formKey={"CheckoutVendor"}
          />

        </FormSection>

        <FormSection sectionKey="TokenSelection" isNested disableOnReset>
          <FlexGrid>
            {Tokens.map((token: TokenFieldModel, index: number) => (
              <TokenInput
                key={selectedMarket?.market_name + token.Token.type}
                name={token.Token.type}
                type={token.Token.type}
                perDollarValue={token.Token.per_dollar_value}
                listIndex={index}
                formKey={token.Token.type + index}
                onChange={handleTokensChanged} />
            ))}
          </FlexGrid>
        </FormSection>
      </MSMForm>

      <FlexGrid>
        <DescribeText text={getMarketFeeCalculationString()}>
          <DataLabel label="Market Fee" value={marketFee} />
        </DescribeText>
        <DataLabel label="Profit" value={netVendorProfit} />
      </FlexGrid>
    </div>
  );

};

export default Checkout;
