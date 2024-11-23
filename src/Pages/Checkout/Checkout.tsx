import dayjs, { Dayjs } from "dayjs";
import MSMDatePicker from "../../Components/Inputs/DatePicker";
import SearchableDropdownSelector from "../../Components/Inputs/SearchableDropdownSelector";
import DropdownSelector from "../../Components/Inputs/DropdownSelector";
import TokenInput from "../../Components/Inputs/TokenInput";
import {
  MarketToken,
  Vendor,
  MarketFee,
} from "../../lib/Constants/DataModels";

import { useState, useEffect, useMemo, useCallback } from "react";
import '../../index.css';
import DataLabel from "../../Components/DataLabel/DataLabel";
import FlexGrid from "../../FlexGrid/FlexGrid";
import MSMForm from "../../Components/Form Flow/MSMForm";
import FormSection from "../../Components/Form Flow/FormSection";
import FormData from "../../Components/Form Flow/FormData";
import { resetMSMFormSections } from "../../Components/Form Flow/MSMFormStateFunctions";

import { DisplayErrorAlert, DisplayAlert } from "../../Components/Popups/PopupHelpers";
import { FeeType } from "../../lib/Constants/Types";
import { capitalizeFirstLetter } from "../../Helpers";
import DescribeText from "../../Components/DescribeText";
import { callEndpoint } from "../../lib/API/APIDefinitions";
import { GetCheckoutOptions, CheckoutOption, TokenSubmit, CheckoutSubmit } from "./CheckoutAPICalls";
import { GetCheckoutData } from "./CheckoutAPICalls";
import { SubmitCheckout } from "./CheckoutAPICalls";
import ActionButton from "../../Components/Buttons/ActionButton";
import { DefaultApiResult, callEndpointWithState, APIResult } from "../../lib/API/APIDefinitions";
import Icon, { IconSrcs } from "../../Components/MSMIcon/Icon";

//To keep track of Token Fields
interface TokenFieldModel {
  quantity: number;
  token: MarketToken;
}

const createTokenFieldModel = (quantity: number, token: MarketToken): TokenFieldModel => ({ quantity, token });

//To treat Gross Profit as a token
const GrossProfitTokenModel: TokenFieldModel = {
  quantity: 0,
  token: { id: 1, type: "Gross Profit", per_dollar_value: 1 },
}


const Checkout = () => {

  // State Variables
  const [Markets, setMarkets] = useState<CheckoutOption[]>([]);
  const [Vendors, setVendors] = useState<Vendor[]>([]);
  const [Fees, setFees] = useState<MarketFee[]>([]);
  const [Tokens, setTokens] = useState<TokenFieldModel[]>([GrossProfitTokenModel]);
  const [selectedMarket, setSelectedMarket] = useState<CheckoutOption>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor>();
  const [netVendorProfit, setNetVendorProfit] = useState<number>(0);
  const [marketFee, setMarketFee] = useState<number>(0);
  const [marketFeeModel, setMarketFeeModel] = useState<MarketFee | null>(null);


////////////////////////////////
//       STATE HANDLERS       //
//////////////////////////////// 
  const handleMarketChanged = (value: string) => {

    let newMarket: CheckoutOption | undefined = Markets.find((market: CheckoutOption) => market.market_name === value);
    setSelectedMarket(newMarket);
    resetMSMFormSections();
    
  };

  const handleDateChanged = (value: Dayjs | null) => { setSelectedDate(value); };

  const handleVendorChanged = (value: string) => {

    console.log(Vendors)
    let selectedVendor: Vendor | undefined = Vendors.find((vendor: Vendor) => vendor.business_name === value);
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
      
      let PDV = Tokens[fieldIndex].token.per_dollar_value
      return fieldIndex > 0 ?
        prev + Tokens[fieldIndex].quantity * PDV - newValue * PDV :
        prev - Tokens[0].quantity + newValue;
      
    });

    setTokens((prev) => {prev[fieldIndex].quantity = newValue; return [...prev];});

    calculateMarketFee();
  };

    // Update the market fee model when the vendor changes
    useEffect(() => {

      const fee = Fees.find((fee: MarketFee) => fee.vendor_type === selectedVendor?.type) || null
      setMarketFeeModel(fee);

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
    let Data: CheckoutSubmit = {
      market_vendor_id: selectedVendor?.market_vendor_id,
      market_date: selectedDate?.format("YYYY-MM-DD"),
      reported_gross: Tokens[0].quantity,
      fees_paid: netVendorProfit,
      tokens: GenerateTokensForSubmission(),
    };

    //Submit Checkout
    callEndpoint({
      endpointCall: SubmitCheckout(1, Data),
      onSuccess: (data, statusCode) => {
        DisplayAlert('success', "Submitted Checkout", statusCode)
      },
      onError: (errorCode) => {
        DisplayAlert('error', "Checkout failed", errorCode)
      }
    });
  };


////////////////////////////////
//        USE EFFECTS         //
////////////////////////////////

  // On Mount
  useEffect(() => {
    callEndpoint({
      endpointCall: GetCheckoutOptions(1),
      onSuccess: (data) => {
        setMarkets(data)
      },
      onError: (errorCode) => {
        DisplayAlert('error', "Could not get checkout options.", errorCode)
      }
    })
  }, []);

  // On Market or Date Changed
  useEffect(() => {
    if (selectedMarket !== undefined && selectedDate !== null) {
      callEndpoint({
        endpointCall: GetCheckoutData(1, selectedMarket.market_id, selectedDate),
        onSuccess: (data) => {
          setVendors(data.vendors)
          setTokens([GrossProfitTokenModel, ...data.market_tokens.map((token) => createTokenFieldModel(0, token))])
          setFees(data.market_fees ?? [])
        },
        onError: (errorCode) => {
          DisplayAlert('error', "Could not get checkout data.", errorCode)
        }
      })
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
        let tokensToSubmit: TokenSubmit[] = [];
        Tokens.forEach((token: TokenFieldModel, index: number) => {

          //Don't include gross profit
          if (index !== 0) {
            tokensToSubmit.push({ market_token_id: token.token.id, count: token.quantity }); 
          }});

        return tokensToSubmit;
      };

  return (
    <div className="DefaultCenterPageContainer">

      <h1>Checkout</h1>

      <MSMForm isAuto onSubmit={submitCheckoutToDatabase}>
        <FormSection sectionKey="CheckoutOptions">

           {/* MARKET SELECTION */}
          <DropdownSelector
            options={Markets.map((checkout_option: CheckoutOption) => checkout_option.market_name)}
            defaultValue={Markets[0] ? Markets[0].market_name : ""}
            onChanged={handleMarketChanged}
            formKey={"Market"}
          />
          
          {/* DATE SELECTION */}
          <MSMDatePicker
            defaultDate={dayjs()}
            onDateChanged={handleDateChanged}
            formKey={"Date"}
            sx={{ width: "100%" }}
            validationFunction={(date) => {
              if (!date) {
                return "Date must have a value.";
              }
              if (date >= dayjs()) {
                return "Date must be today or before.";
              }
              return null; // No error
            }}
          />


        </FormSection>

        <FormSection sectionKey="VendorSelection" disableOnReset>

          {/* VENDOR SELECTION */}
          <SearchableDropdownSelector
            options={[...Vendors.map((vendor: Vendor) => {return vendor.business_name})]}
            firstselected=""
            onSelect={handleVendorChanged}
            formKey="CheckoutVendor"
          />

        </FormSection>

        <FormSection sectionKey="TokenSelection" isNested disableOnReset>
          <FlexGrid>
            {Tokens.map((token: TokenFieldModel, index: number) => (
              <TokenInput
                key={selectedMarket?.market_name + token.token.type}
                name={token.token.type}
                type={token.token.type}
                perDollarValue={token.token.per_dollar_value}
                listIndex={index}
                formKey={token.token.type + index}
                onChange={handleTokensChanged} />
            ))}
          </FlexGrid>
        </FormSection>


        <FormData>
          <FlexGrid>
            <DescribeText text={getMarketFeeCalculationString()}>
              <DataLabel label="Market Fee" value={marketFee} />
            </DescribeText>
            <DataLabel label="Profit" value={netVendorProfit} />
          </FlexGrid>
        </FormData>
      </MSMForm>

    </div>
  );

};

export default Checkout;
