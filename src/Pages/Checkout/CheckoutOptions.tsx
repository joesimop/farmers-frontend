import React, { useEffect, useState } from "react";
import { z } from "zod";
import MSMForm from "@MSMComponents/Form Flow/MSMForm";
import MSMFormField from "@MSMComponents/Form Flow/MSMFormField";
import MSMCardSelect from "@MSMComponents/Inputs/MSMCardSelect";
import MSMCalendarPicker from "@MSMComponents/Inputs/MSMCalendarPicker";
import { callEndpoint } from "@lib/API/APIDefinitions";
import { DisplayAlert } from "@MSMComponents/Popups/PopupHelpers";
import { CheckoutOption, GetCheckoutOptions } from "./CheckoutAPICalls";
import { useNavigate } from "react-router-dom";
import MSMPage from "@MSMComponents/Layout/MSMPage";

// Define the type for market selection
type MarketSelect = [marketName: string, marketId: number];

// Zod schema for form validation
const CheckoutOptionsSchema = z.object({
  market: z
    .tuple([z.string(), z.number()])
    .refine(([name, id]) => name.length > 0 && id > 0, {
      message: "Market must be selected",
    }),
  date: z
    .date()
    .refine((val) => val !== null, { message: "Date is required" })
    .refine((val) => val && val < new Date(), { message: "Date must be before today" }),
});


const CheckoutOptions: React.FC = () => {
  // State variables
  const [possibleMarkets, setPossibleMarkets] = useState<CheckoutOption[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<MarketSelect | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const navigate = useNavigate()

  // Fetch checkout options on mount
  useEffect(() => {
    callEndpoint({
      endpointCall: GetCheckoutOptions(1),
      onSuccess: setPossibleMarkets,
      onError: (errorCode) => {
        DisplayAlert("error", "Could not get checkout options.", errorCode);
      },
    });
  }, []);

  // Generate the submit button text
  const generateSubmitButtonText = () => {

    if (!selectedMarket || !selectedDate) { return "Select a Market and Date to checkout." }

    const marketName =
      possibleMarkets.find((market) => market.market_id === selectedMarket?.[1])?.market_name ||
      "Market";
    const dateText = selectedDate?.toLocaleDateString() || "";
    return `Checkout ${marketName} on ${dateText}`;
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (selectedMarket && selectedDate) {
      const marketId = selectedMarket[1];
      const marketName = selectedMarket[0];
      const date = selectedDate.toISOString()
      navigate(`/checkout?market=${encodeURIComponent(marketId)}&date=${encodeURIComponent(date)}&market_name=${encodeURIComponent(marketName)}`);
    }
  };

  return (
    <MSMPage title="Checkout Select" titleDescription="Choose the market and date to submit a checkout. ">
      <MSMForm
        schema={CheckoutOptionsSchema}
        onSubmit={handleFormSubmit}
        submitButtonText={generateSubmitButtonText()}
        centerSubmitButton
      >
        {/* Market Selection */}
        <MSMFormField name="market" label="Market">
          {({ field }) => (
            <MSMCardSelect
              items={possibleMarkets.map((m) => [m.market_name, m.market_id])}
              value={selectedMarket}
              onChange={(value) => {
                field.onChange(value);
                setSelectedMarket(value as MarketSelect);
              }}
              renderCard={(item) => <span>{item[0]}</span>}
            />
          )}
        </MSMFormField>

        {/* Date Selection */}
        <MSMFormField name="date" label="Date">
          {({ field }) => (
            <div className="flex justify-center">
              <MSMCalendarPicker
                value={selectedDate}
                onChange={(date) => {
                  field.onChange(date);
                  setSelectedDate(date);
                }}
              />
            </div>
          )}
        </MSMFormField>
      </MSMForm>
    </MSMPage>
  );
};

export default CheckoutOptions;
