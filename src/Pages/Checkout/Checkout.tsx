import {
  MarketToken,
  Vendor,
  MarketFee,
  MarketVendor,
} from "../../lib/Constants/DataModels";

import { useState, useEffect, useMemo, useCallback } from "react";

import { DisplayErrorAlert, DisplayAlert, DisplaySuccessAlert } from "@MSMComponents/Popups/PopupHelpers";
import { FeeType, VendorType } from "../../lib/Constants/Types";
import { calculateCPCStatus, toReadableDate, toReadableString } from "../../Helpers";
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
import MSMHorizontalDivideLine from "@MSMComponents/Layout/MSMHorizontalDivideLine";
import MSMSplitView from "@MSMComponents/Layout/MSMSplitView";
import { MSMVendorBadge } from "@MSMComponents/DataDisplay/MSMVendorBadge";
import MSMEnumDropdown from "@MSMComponents/Inputs/MSMEnumDropdown";
import { BannerAlert } from "@MSMComponents/Popups/BannerAlert";
import { CPCStatus } from "@MSMComponents/CPCComponents/CPCStatusBadge";
import { DisplayModal } from "@MSMComponents/Popups/PopupHelpers";

//To keep track of Token Fields
interface TokenFieldModel {
  quantity: number;
  token: MarketToken;
}



const createTokenFieldModel = (quantity: number, token: MarketToken): TokenFieldModel => ({ quantity, token });

//To treat Gross Profit as a token
const GrossProfitTokenModel: TokenFieldModel = {
  quantity: 0,
  token: { id: 0, type: "GROSS_PROFIT", per_dollar_value: 1 },
}


const Checkout = () => {

  // State Variables
  const [Vendors, setVendors] = useState<MarketVendor[]>([]);
  const [Fees, setFees] = useState<MarketFee[]>([]);
  const [Tokens, setTokens] = useState<TokenFieldModel[]>([GrossProfitTokenModel]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor>();
  const [netVendorProfit, setNetVendorProfit] = useState<number>(0);
  const [marketFee, setMarketFee] = useState<number>(0);
  const [marketFeeModel, setMarketFeeModel] = useState<MarketFee | null>(null);

  const [searchParams] = useSearchParams();
  const [CPCStatus, setCPCStatus] = useState<CPCStatus>("Up to Date");
  const [CPCBannerText, setCPCBannerText] = useState<string>("");
  const [CPCExprTitleText, setCPCTitleText] = useState<string>("CPC Alert");
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
        return `No fee found for ${toReadableString(selectedVendor.type)}`;
      }
      return "No fees applicable."
    }

    const GP = Tokens[0].quantity; // Gross Profit

    switch (marketFeeModel.fee_type) {
      case FeeType.PERCENT_GROSS:
        return `${marketFeeModel.percent * 100}% Percent of Gross`;

      case FeeType.FLAT_FEE:
        return `Flat Fee: $${marketFee}`;

      case FeeType.FLAT_PERCENT_COMBO:
        return `Flat + Percent: $${marketFeeModel.flat} + (${GP} * ${marketFeeModel.percent})`;

      case FeeType.MAX_OF_EITHER:
        const percentFee = marketFeeModel.percent * GP;
        return `Max: $${marketFeeModel.flat} or ${percentFee}`;

      case FeeType.GOV_FEE:
        return `Gov Fee: $${marketFee}`;

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

  const refreshCPCBanner = () => {
    let cpc_expr = new Date(selectedVendor?.cpc_expr ?? "");
    if (selectedVendor?.cpc_expr) {
      const { status, daysLeft } = calculateCPCStatus(cpc_expr);
      setCPCStatus(status);
      setCPCTitleText(`CPC Alert!`);
      setCPCBannerText(`Expr Date: ${cpc_expr.toLocaleDateString()}; due 
        ${status !== 'Past Due' ? "in" : ""}  
        ${Math.abs(daysLeft)} days 
        ${status === 'Past Due' ? "ago" : ""} `);

    } else {
      setCPCStatus("Up to Date");
      setCPCBannerText("");
    }
  }

  // Update the market fee model when the vendor changes
  useEffect(() => {
    const fee = Fees.find((fee: MarketFee) => fee.vendor_type === selectedVendor?.type) || null
    setMarketFeeModel(fee);
    refreshCPCBanner();
  }, [selectedVendor, Fees]);

  // Recalculate the market fee when the model or tokens change
  useEffect(() => {
    calculateMarketFee();
  }, [marketFeeModel, Tokens]);

  const verifyCheckout = (data: any) => {

    if (CPCStatus === "Past Due" || CPCStatus === "Due Urgently") {
      DisplayModal({
        onConfirm() { submitCheckoutToDatabase(data); return Promise.resolve(true); },
        onCancel() { return Promise.resolve(false); },
        title: "CPC Alert",
        content: <div>Are You Sure You Want to submit with an invalid cpc?</div>,
        confirmText: "Submit"
      })
    } else {
      submitCheckoutToDatabase(data)
    }
  }

  const submitCheckoutToDatabase = (data: any) => {

    console.log("fweakkinngg")
    if (date) {
      // Builds the data sent to the db
      let Data: CheckoutSubmit = {
        market_vendor_id: data.vendor,
        market_date: date,
        reported_gross: data.GROSS_PROFIT,
        fees_paid: netVendorProfit,
        tokens: GenerateTokensForSubmission(data),
      };

      console.log("Data: ", Data)

      //Submit Checkout
      callEndpoint({
        endpointCall: SubmitCheckout(1, Data),
        onSuccess: () => {
          console.log("here")
          DisplaySuccessAlert("Submitted Checkout")
        },
        onError: (errorCode) => {
          console.log("not here")
          DisplayErrorAlert("Checkout failed", errorCode)
        }
      });
    }
  }


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

  // Assembles tokens for transaction push
  const GenerateTokensForSubmission = (data: Record<string, any>): TokenSubmit[] => {

    const tokenEntries = Object.entries(data);

    // Filter out "vendor" and "GROSS_PROFIT" keys
    const filteredTokens = tokenEntries.filter(
      ([key]) => key !== "vendor" && key !== "GROSS_PROFIT"
    );

    const tokensToSubmit: TokenSubmit[] = filteredTokens.map(([key, value]) => ({
      market_token_id: Tokens.find((token) => token.token.type === key)?.token.id ?? 0,
      count: value,
    }));

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
      titleDescription={`${marketName} on ${toReadableDate(date ?? Date())}`}>
      <MSMForm
        schema={dynamicSchema}
        onSubmit={verifyCheckout}
        persistOnReset={['vendor']}
        autoFocusField="GROSS_PROFIT"
        clearOnSubmit
        centerSubmitButton
        isAuto>

        <div className="flex flex-row gap-x-1 space-x-4 items-end">

          <div className="flex-grow">
            <MSMFormField name="vendor" label="Vendor" >
              {({ field, focusNextField }) => (
                <MSMDropdown
                  items={convertToDropdownItems(Vendors, "business_name", "market_vendor_id")}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setSelectedVendor(Vendors.find((v) => v.market_vendor_id === Number(value)));
                  }}
                  focusNext={focusNextField}
                  ref={field.ref}
                />
              )}
            </MSMFormField>
          </div>
          <div className="mb-2 min-w-6">
            <MSMVendorBadge vendorType={selectedVendor?.type} />
          </div>
        </div>

        {(CPCStatus === "Past Due" || CPCStatus === "Due Urgently") &&
          <div className="mt-4">
            <BannerAlert variant="destructive" title={CPCExprTitleText} text={CPCBannerText} />
          </div>}

        <MSMHorizontalDivideLine />

        <MSMFlexGrid minColumns={2}>
          {Tokens.map((token: TokenFieldModel, index: number) => (
            <MSMFormField key={token.token.type}
              name={token.token.type}
              label={toReadableString(token.token.type)}>
              {({ field, focusNextField }) => (
                <MSMNumericalInput
                  min={0}
                  value={field.value}
                  onChange={(quantity) => {
                    const quantityValue = quantity === undefined ? 0 : quantity
                    handleTokensChanged(quantityValue * token.token.per_dollar_value, index);
                    field.onChange(quantity)
                  }}
                  focusNext={focusNextField}
                  ref={field.ref}
                />
              )}
            </MSMFormField>
          ))}
        </MSMFlexGrid>

        <MSMSplitView className="text-left py-8"
          left={
            <>
              <span className="text-3xl font-bold">Net Profit</span><br />
              <MSMMoneyDisplay
                value={netVendorProfit}
                className={`text-2xl font-bold
              ${netVendorProfit < 0 ? "text-destructive" : "text-green-700"}`} />
            </>
          }
          right={
            <DescribeText text={getMarketFeeCalculationString()}>
              <span className="text-3xl font-bold">Market Fee</span><br />
              <MSMMoneyDisplay
                value={marketFee}
                className="text-2xl" />
            </DescribeText>
          }
        />

      </MSMForm>
    </MSMPage>
  );

};

export default Checkout;
