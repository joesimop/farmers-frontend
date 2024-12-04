import React, { useState } from "react";
import { z } from "zod";
import MSMForm from "@MSMComponents/Form Flow/MSMForm";
import MSMFormField from "@MSMComponents/Form Flow/MSMFormField";
import MSMCardSelect from "@MSMComponents/Inputs/MSMCardSelect";
import MSMPage from "@MSMComponents/Layout/MSMPage";
import MSMMultiCardSelect from "@MSMComponents/Inputs/MSMMultiCardSelect";
import { MSMDropdownItem } from "@MSMComponents/Inputs/MSMDropdown";
import DescribeText from "@MSMComponents/DescribeText";
import { AxiosResponse } from "axios";
import { axiosInstance, callEndpoint } from "@lib/API/APIDefinitions";
import { DisplayErrorAlert, DisplaySuccessAlert } from "@MSMComponents/Popups/PopupHelpers";

interface AddVendorToMarketsFormProps {
    vendorName: string;                  // Vendor's name
    vendorId: number;
    markets: MSMDropdownItem[]; // List of markets
    onSubmit: () => void;
}

interface CreateAddVendorToMarkets {
    vendor_id: number;
    market_ids: number[];
}
const AddVendorToMarkets = async (vendorId: number, markets: MSMDropdownItem[]): Promise<AxiosResponse> => {

    const data = {
        vendor_id: vendorId,
        market_ids: markets.map((m) => m.value)
    }
    let urlString = `/vendor/join_markets`;
    return axiosInstance.post(urlString, data);

}

const AddVendorToMarketsForm: React.FC<AddVendorToMarketsFormProps> = ({ vendorName, vendorId, markets, onSubmit }) => {

    // State to hold selected markets
    const [selectedMarkets, setSelectedMarkets] = useState<MSMDropdownItem[]>([]);

    // Schema for form validation
    const AddVendorSchema = z.object({
        markets: z
            .array(z.object({ market: z.string(), market_id: z.number() }))
    });

    // Generate submit button text
    const generateSubmitButtonText = () => {
        if (selectedMarkets.length === 0) {
            return "Continue without adding";
        }
        const marketNames = selectedMarkets.map((market) => market.displayName).join(", ");
        return `Add ${vendorName} to ${marketNames}`;
    };

    // Handle form submission
    const handleFormSubmit = () => {

        if (selectedMarkets.length != 0) {
            callEndpoint({
                endpointCall: AddVendorToMarkets(vendorId, selectedMarkets),
                onSuccess: () =>
                    DisplaySuccessAlert(`${vendorName} add to markets!`),

                onError: (error) => DisplayErrorAlert("Could not add vendor to markets", error),
            });
        }

        onSubmit()
    };

    return (
        <>
            <span className="text-sm text-gray-700 italic block mb-1">Select which markets you would like to add to.</span>

            <MSMForm
                onSubmit={handleFormSubmit}
                submitButtonText={generateSubmitButtonText()}
                centerSubmitButton
            >
                <div className="mt-3 mb-6">


                    {/* Market Selection */}
                    <MSMFormField name="markets" label="Markets">
                        {({ field }) => (
                            <MSMMultiCardSelect
                                items={markets}
                                values={selectedMarkets}
                                onChange={(selected) => {
                                    console.log(selected)
                                    field.onChange(selected);
                                    setSelectedMarkets(selected);
                                }}
                                renderCard={(market) => <span>{market.displayName}</span>}
                            />
                        )}
                    </MSMFormField>
                </div>
            </MSMForm>
        </>
    );
};

export default AddVendorToMarketsForm;
