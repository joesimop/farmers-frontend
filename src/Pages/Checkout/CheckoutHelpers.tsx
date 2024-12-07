import { MarketToken, MarketFee, Vendor } from "../../lib/Constants/DataModels";
import { CPCStatus, TokenType } from "../../lib/Constants/Types";
import { calculateCPCStatus, toReadableString } from "../../Helpers";
import { TokenFieldModel } from "./Checkout";


// Create TokenFieldModel helper
export const createTokenFieldModel = (quantity: number, token: MarketToken) => ({
    quantity,
    token,
});

// Generate CPC Banner text
export const generateCPCBannerText = (
    cpc_expr: Date,
    selectedVendor: Vendor | undefined
): { status: CPCStatus; bannerText: string } => {
    if (selectedVendor?.cpc_expr) {
        const { status, daysLeft } = calculateCPCStatus(cpc_expr);
        const bannerText = `Expr Date: ${cpc_expr.toLocaleDateString()}; due ${status !== CPCStatus.PAST_DUE ? "in" : ""
            } ${Math.abs(daysLeft)} days ${status === CPCStatus.PAST_DUE ? "ago" : ""}`;
        return { status, bannerText };
    }
    return { status: CPCStatus.PAST_DUE, bannerText: "" };
};

// Generate the string explaining the market fee calculation
export const getMarketFeeCalculationString = (
    selectedMarketFee: MarketFee | null,
    fees: MarketFee[],
    selectedVendor: Vendor | undefined,
    grossProfit: number | undefined
): string => {
    if (!fees.length) {
        return "No vendor fees found for this market";
    }

    if (!selectedMarketFee) {
        return selectedVendor
            ? `No fee found for ${toReadableString(selectedVendor.type)}`
            : "No fees applicable.";
    }

    const GP = grossProfit || 0;

    switch (selectedMarketFee.fee_type) {
        case "PERCENT_GROSS":
            return `${selectedMarketFee.percent * 100}% Percent of Gross`;

        case "FLAT_FEE":
            return `Flat Fee: $${selectedMarketFee.flat}`;

        case "FLAT_PERCENT_COMBO":
            return `Flat + Percent: $${selectedMarketFee.flat} + (${GP} * ${selectedMarketFee.percent
                })`;

        case "MAX_OF_EITHER":
            const percentFee = selectedMarketFee.percent * GP;
            return `Max: $${selectedMarketFee.flat} or ${percentFee}`;

        case "GOV_FEE":
            return `Gov Fee: $${selectedMarketFee.flat}`;

        default:
            return "Unknown fee type";
    }
};

// Assembles tokens for transaction submission
export const GenerateTokensForSubmission = (Tokens: TokenFieldModel[]) => {
    return Tokens.map((tokenField) => ({
        market_token_id: tokenField?.token.id ?? 0,
        count: tokenField?.quantity,
    }));
};

// Helper to get token label
export const getTokenLabel = (token: MarketToken): string => {
    const readableType = TokenType.toString(token.type);
    const valueSuffix =
        token.per_dollar_value !== 1 ? ` - $${token.per_dollar_value}` : "";
    return `${readableType}${valueSuffix}`;
};
