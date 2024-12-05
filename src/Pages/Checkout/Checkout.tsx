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
import DescribeText from "@MSMComponents/DataDisplay/DescribeText";
import { APIResult, APIResultState, callEndpoint, callEndpointWithState, DefaultApiResult } from "../../lib/API/APIDefinitions";
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
import MSMMoneyDisplay from "@MSMComponents/DataDisplay/MSMMoneyDisplay";
import MSMHorizontalDivideLine from "@MSMComponents/Layout/MSMHorizontalDivideLine";
import MSMSplitView from "@MSMComponents/Layout/MSMSplitView";
import { MSMVendorBadge } from "@MSMComponents/DataDisplay/MSMVendorBadge";
import { BannerAlert } from "@MSMComponents/Popups/BannerAlert";
import { DisplayModal } from "@MSMComponents/Popups/PopupHelpers";
import { CPCStatus } from "../../lib/Constants/Types";
import APIResultDisplay from "@MSMComponents/APIResultDisplay";
import { HttpStatusCode } from "axios";
import { createTokenFieldModel, generateCPCBannerText, GenerateTokensForSubmission, getMarketFeeCalculationString, getTokenLabel } from "./CheckoutHelpers";

//Checkout Config that won't change throughout the checkout
interface CheckoutConfig {
  vendors: MarketVendor[]
  fees: MarketFee[]
}

//To keep track of Token Fields
export interface TokenFieldModel {
  quantity: number;
  token: MarketToken;
}

const Checkout = () => {

  // State Variables
  const [checkoutConfig, setCheckoutConfig] = useState<APIResult<CheckoutConfig>>(DefaultApiResult);
  const [Tokens, setTokens] = useState<TokenFieldModel[]>([]);
  const [grossProfit, setGrossProfit] = useState<number | undefined>(undefined)
  const [selectedVendor, setSelectedVendor] = useState<Vendor>();
  const [moneyOwed, setMoneyOwed] = useState<number>(0);
  const [marketFee, setMarketFee] = useState<number>(0);
  const [selectedMarketFee, setSelectedMarketFee] = useState<MarketFee | null>(null);

  //CPC Banner State
  const [vendorCPCStatus, setCPCStatus] = useState<CPCStatus>(CPCStatus.UP_TO_DATE);
  const [CPCBannerText, setCPCBannerText] = useState<string>("");

  //Variables from Search Params
  const [searchParams] = useSearchParams();
  const marketId = searchParams.get('market')
  const marketName = searchParams.get("market_name")
  const date = searchParams.get('date')

  ////////////////////////////////
  //       STATE HANDLERS       //
  //////////////////////////////// 

  //Called on form clear
  const resetCheckoutState = () => {
    const resetTokens = Tokens.map((token) => ({ ...token, quantity: 0 }));
    setTokens(resetTokens);
    setGrossProfit(0)
  }

  const calculateMarketFee = useCallback(() => {

    if (!selectedMarketFee) {
      setMarketFee(0);
      return 0;
    }
    let calculatedFee = 0;

    let GP = grossProfit || 0;

    switch (selectedMarketFee.fee_type) {
      case FeeType.PERCENT_GROSS: calculatedFee = GP * selectedMarketFee.percent; break;
      case FeeType.FLAT_FEE: calculatedFee = selectedMarketFee.flat; break;
      case FeeType.FLAT_PERCENT_COMBO: calculatedFee = selectedMarketFee.flat + selectedMarketFee.percent * GP; break;
      case FeeType.MAX_OF_EITHER: calculatedFee = selectedMarketFee.flat > selectedMarketFee.percent * GP ? selectedMarketFee.flat : selectedMarketFee.percent * GP; break;
      case FeeType.GOV_FEE: calculatedFee = selectedMarketFee.flat

    }

    setMarketFee(calculatedFee);

    return calculatedFee;

  }, [selectedMarketFee, Tokens, grossProfit]);


  const handleTokensChanged = (newQuantity: number, fieldIndex: number) => {

    //First update the new token quantity
    const updatedTokens = Tokens.map((token, index) =>
      index === fieldIndex
        ? { ...token, quantity: newQuantity }
        : token
    );
    setTokens(updatedTokens);
  };

  const refreshCPCBanner = () => {
    let cpc_expr = new Date(selectedVendor?.cpc_expr ?? "");
    const { status, bannerText } = generateCPCBannerText(cpc_expr, selectedVendor)
    setCPCStatus(status);
    setCPCBannerText(bannerText)
  }

  const verifyCheckout = (data: any) => {

    //Verify the CPC, if bad, display modal
    if (vendorCPCStatus === CPCStatus.PAST_DUE || vendorCPCStatus === CPCStatus.URGENT) {
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

    if (date) {
      // Builds the data sent to the db
      let Data: CheckoutSubmit = {
        market_vendor_id: data.vendor,
        market_date: date,
        reported_gross: data.gross_profit,
        fees_paid: marketFee,
        tokens: GenerateTokensForSubmission(Tokens),
      };

      //Submit Checkout
      callEndpoint({
        endpointCall: SubmitCheckout(1, Data),
        onSuccess: () => {
          DisplaySuccessAlert("Submitted Checkout")
        },
        onError: (errorCode) => {
          DisplayErrorAlert("Checkout failed", errorCode)
        }
      });
    }
  }


  ////////////////////////////////
  //        USE EFFECTS         //
  ////////////////////////////////

  // On Mount
  // NOTE: custom result state handling due to complex state setting.
  useEffect(() => {

    if (marketId && date) {

      //Set Loading State
      setCheckoutConfig((prevState) => ({
        ...prevState,
        state: APIResultState.LOADING,
      }));

      callEndpointWithState({
        endpointCall: GetCheckoutData(1, parseInt(marketId), date),
        onSuccess: (data, statusCode) => {

          //Set the nonchanging data
          setCheckoutConfig({
            data: { vendors: data.vendors, fees: data.market_fees },
            state: APIResultState.SUCCESS,
            status: statusCode ?? HttpStatusCode.Ok
          })

          //Setup token fields
          setTokens([...data.market_tokens.map((token) => createTokenFieldModel(0, token))])
        },
        onError: (errorCode) => {
          DisplayAlert('error', "Could not get checkout data.", errorCode)
        }
      })
    }
  }, []);

  // Recalculate the market fee when the model or tokens change
  useEffect(() => {
    const newMarketFee = calculateMarketFee();
    const tokensValue = Tokens.reduce((acc, token) => {
      const tokenValue = token.quantity * token.token.per_dollar_value;
      return acc + tokenValue
    }, 0);
    setMoneyOwed(newMarketFee - tokensValue)
  }, [selectedMarketFee, Tokens, grossProfit]);

  // Update the market fee model when the vendor changes
  useEffect(() => {

    if (checkoutConfig.data) {

      const fee = checkoutConfig.data.fees.find(
        (fee: MarketFee) => fee.vendor_type === selectedVendor?.type) || null

      setSelectedMarketFee(fee);
      refreshCPCBanner();
    }

  }, [selectedVendor]);


  // Update the schema dynamically based on tokens
  const dynamicSchema = useMemo(() => {
    const tokenSchema = Tokens.reduce((acc, token) => {
      acc[token.token.type] = z.number().min(0, `${token.token.type} must be at least 0.`);
      return acc;
    }, {} as Record<string, z.ZodNumber>);

    return z.object({
      vendor: z.number().min(1, "Vendor is required."),
      gross_profit: z.number().min(1, "Gross Profit is required."),
      ...tokenSchema,
    });
  }, [Tokens]);


  return (
    <MSMPage title="Checkout"
      titleDescription={`${marketName} on ${toReadableDate(date ?? Date())}`}>

      <APIResultDisplay result={checkoutConfig}>
        {(data) => (
          <MSMForm
            schema={dynamicSchema}
            onSubmit={verifyCheckout}
            onReset={resetCheckoutState}
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
                      items={convertToDropdownItems(data.vendors, "business_name", "market_vendor_id")}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setSelectedVendor(data.vendors.find((v) => v.market_vendor_id === Number(value)));
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

            {(vendorCPCStatus === CPCStatus.PAST_DUE || vendorCPCStatus === CPCStatus.URGENT) &&
              <div className="mt-4">
                <BannerAlert variant="destructive" title={"CPC Alert"} text={CPCBannerText} />
              </div>
            }

            <MSMHorizontalDivideLine />

            <MSMFlexGrid minColumns={2}>

              {/* Gross Profit field */}
              <MSMFormField key={"GROSS_PROFIT"}
                name={"gross_profit"}
                label={"Gross Profit"}>
                {({ field, focusNextField }) => (
                  <MSMNumericalInput
                    min={0}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setGrossProfit(value);
                    }}
                    focusNext={focusNextField}
                    ref={field.ref}
                  />
                )}
              </MSMFormField>

              {/* Token Fields */}
              {Tokens.map((token: TokenFieldModel, index: number) => (
                <MSMFormField key={token.token.type}
                  name={token.token.type}
                  label={getTokenLabel(token.token)}>
                  {({ field, focusNextField }) => (
                    <MSMNumericalInput
                      min={0}
                      value={field.value}
                      onChange={(quantity) => {
                        const quantityValue = quantity === undefined ? 0 : quantity
                        handleTokensChanged(quantityValue, index);
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
              right={
                <DescribeText text="Owed = Fee - Token Total">
                  <span className="text-3xl font-bold">Money Owed</span><br />
                  <MSMMoneyDisplay
                    value={moneyOwed}
                    className={`text-2xl font-bold ${moneyOwed < 0 ? "text-destructive" : "text-green-700"}`} />
                </ DescribeText>
              }
              left={
                <DescribeText text={getMarketFeeCalculationString(selectedMarketFee, data.fees, selectedVendor, grossProfit)}>
                  <span className="text-3xl font-bold">Market Fee</span><br />
                  <MSMMoneyDisplay
                    value={marketFee}
                    className="text-2xl" />
                </DescribeText>
              }
            />


          </MSMForm>
        )}
      </APIResultDisplay>

    </MSMPage>
  );

};

export default Checkout;
