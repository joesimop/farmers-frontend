import {
  MarketToken,
  Vendor,
  MarketFee,
} from "../../lib/Constants/DataModels";

import { useState, useEffect, useMemo, useCallback } from "react";

import { DisplayErrorAlert, DisplayAlert } from "@MSMComponents/Popups/PopupHelpers";
import { FeeType } from "../../lib/Constants/Types";
import { capitalizeFirstLetter } from "../../Helpers";
import DescribeText from "@MSMComponents/DescribeText";
import { callEndpoint } from "../../lib/API/APIDefinitions";
import { TokenSubmit, CheckoutSubmit } from "./CheckoutAPICalls";
import { GetCheckoutData } from "./CheckoutAPICalls";
import { SubmitCheckout } from "./CheckoutAPICalls";
import MSMDropdown, { convertToDropdownItems } from "@MSMComponents/Inputs/MSMDropdown";
import MSMForm from "@MSMComponents/Form Flow/MSMForm";
import MSMFormField from "@MSMComponents/Form Flow/MSMFormField";
import { z } from "zod";
import MSMFlexGrid from "@MSMComponents/Layout/MSMFlexGrid";
import { useSearchParams } from "react-router-dom";
import MSMNumericalInput from "@MSMComponents/Inputs/MSMNumericalInput";
import MSMPage from "@MSMComponents/Layout/MSMPage";
import MSMMoneyDisplay from "@MSMComponents/MSMMoneyDisplay";
import { formatDate } from "date-fns";

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
  const [Vendors, setVendors] = useState<Vendor[]>([]);
  const [Fees, setFees] = useState<MarketFee[]>([]);
  const [Tokens, setTokens] = useState<TokenFieldModel[]>([GrossProfitTokenModel]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor>();
  const [netVendorProfit, setNetVendorProfit] = useState<number>(0);
  const [marketFee, setMarketFee] = useState<number>(0);
  const [marketFeeModel, setMarketFeeModel] = useState<MarketFee | null>(null);

  const [searchParams] = useSearchParams();
  const marketId = searchParams.get('market')
  const marketName = searchParams.get("market_name")
  const date = searchParams.get('date')

  ////////////////////////////////
  //       STATE HANDLERS       //
  //////////////////////////////// 

  const calculateMarketFee = useCallback(() => {

    if (!marketFeeModel) {
      setMarketFee(0);
      return;
    }

    let calculatedFee = 0;

    let GP = Tokens[0].quantity; /* Gross Profit */
    switch (marketFeeModel.fee_type) {
      case FeeType.PERCENT_GROSS: calculatedFee = GP * marketFeeModel.percent; break;
      case FeeType.FLAT_FEE: calculatedFee = marketFeeModel.flat; break;
      case FeeType.FLAT_PERCENT_COMBO: calculatedFee = marketFeeModel.flat + marketFeeModel.percent * GP; break;
      case FeeType.MAX_OF_EITHER: calculatedFee = marketFeeModel.flat > marketFeeModel.percent * GP ? marketFeeModel.flat : marketFeeModel.percent * GP; break;
      case FeeType.GOV_FEE: calculatedFee = marketFeeModel.flat

    }

    setMarketFee(calculatedFee);
  }, [marketFeeModel, Tokens]); /* Fees, Tokens, selectedVendor */

  // Generate the string explaining the market fee calculation
  const getMarketFeeCalculationString = (): string => {

    if (!(Fees && Fees.length > 0)) {
      return "No vendor fees found for this market"
    }

    if (!marketFeeModel) {
      if (selectedVendor) {
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

  const handleTokensChanged = (newQuantity: number, fieldIndex: number) => {

    //First update the new token quantity
    const updatedTokens = Tokens.map((token, index) =>
      index === fieldIndex
        ? { ...token, quantity: newQuantity }
        : token
    );
    setTokens(updatedTokens);

    //Next update the net profit, need to special case the Gross Profit as minus
    const calculatedNetProfit = updatedTokens.reduce((acc, token, index) => {
      const tokenValue = token.quantity * token.token.per_dollar_value;
      return index === 0 ? acc + tokenValue : acc - token.quantity;
    }, 0);

    setNetVendorProfit(calculatedNetProfit);
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

    if (date && selectedVendor) {
      // Builds the data sent to the db
      let Data: CheckoutSubmit = {
        market_vendor_id: selectedVendor?.market_vendor_id,
        market_date: date,
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
    }
  };


  ////////////////////////////////
  //        USE EFFECTS         //
  ////////////////////////////////

  // On Mount
  useEffect(() => {
    if (marketId && date) {
      callEndpoint({
        endpointCall: GetCheckoutData(1, parseInt(marketId), date),
        onSuccess: (data) => {
          setVendors(data.vendors)
          setTokens([GrossProfitTokenModel, ...data.market_tokens.map((token) => createTokenFieldModel(0, token))])
          console.log(data.market_fees)
          setFees(data.market_fees ?? [])
        },
        onError: (errorCode) => {
          DisplayAlert('error', "Could not get checkout data.", errorCode)
        }
      })
    }
  }, []);


  ////////////////////////////////
  //     HELPER FUNCTIONS       //
  //////////////////////////////// 

  //Assembles tokens for transaction push
  const GenerateTokensForSubmission: Function = (): any[] => {
    let tokensToSubmit: TokenSubmit[] = [];
    Tokens.forEach((token: TokenFieldModel, index: number) => {

      //Don't include gross profit
      if (index !== 0) {
        tokensToSubmit.push({ market_token_id: token.token.id, count: token.quantity });
      }
    });

    return tokensToSubmit;
  };

  // Update the schema dynamically based on tokens
  const dynamicSchema = useMemo(() => {
    const tokenSchema = Tokens.reduce((acc, token) => {
      acc[token.token.type] = z.number().min(0, `${token.token.type} must be at least 0.`);
      return acc;
    }, {} as Record<string, z.ZodNumber>);

    return z.object({
      vendor: z.number().min(1, "Vendor is required."),
      ...tokenSchema,
    });
  }, [Tokens]);



  return (
    <MSMPage title="Checkout" 
            titleDescription={`${marketName} on ${formatDate(date ?? Date(), "dd/MM/yyyy")}`}>
      <MSMForm schema={dynamicSchema} onSubmit={() => console.log("HEH")} centerSubmitButton hasClearButton>
        <MSMFormField name="vendor" label="Vendor">
          {({ field }) => (
            <MSMDropdown
              items={convertToDropdownItems(Vendors, "business_name", "id")}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                setSelectedVendor(Vendors.find((v) => v.id === Number(value)));
              }}
              ref={field.ref}
            />
          )}
        </MSMFormField>
        <hr className="w-full my-4" />
        <MSMFlexGrid minColumns={2}>
          {Tokens.map((token: TokenFieldModel, index: number) => (
            <MSMFormField key={token.token.type} name={token.token.type} label={token.token.type}>
              {({ field }) => (
                <MSMNumericalInput
                  value={field.value}
                  onChange={(quantity) => {
                    handleTokensChanged(quantity * token.token.per_dollar_value, index);
                    field.onChange(quantity);
                  }}
                  ref={field.ref}
                />
              )}
            </MSMFormField>
          ))}
        </MSMFlexGrid>

        <div className="text-center">
          <div className="py-4">
            <DescribeText text={getMarketFeeCalculationString()}>
              <span className="text-2xl font-bold">Market Fee</span><br />
              <MSMMoneyDisplay
                value={marketFee}
                className="text-xl" />
            </DescribeText>
          </div>

          <div className="py-4">
            <span className="text-2xl font-bold">Net Profit</span><br />
            <MSMMoneyDisplay
              value={netVendorProfit}
              className={`text-xl 
              ${netVendorProfit < 0 ? "text-destructive" : "text-green-700"}`} />
          </div>
        </div>



      </MSMForm>
    </MSMPage>
  );

};

export default Checkout;
