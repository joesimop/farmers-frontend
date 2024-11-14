// CheckoutDataValidation.ts

import {  MarketTokensModel, VendorModel, MarketFeeModel, MarketCheckoutDataModel } from '../../lib/Constants/DataModels';

export interface TokenFieldModel {
    quantity: number;
    Token: MarketTokensModel;
  }

export const GrossProfitTokenModel: TokenFieldModel = {
quantity: 0,
Token: { id: 1, type: "Gross Profit", per_dollar_value: 1 },
}


export function processMarketsResponse(response: any): MarketCheckoutDataModel[] {
    if (!response?.data) {
      return [];
    }
    return [...response.data];
  }
  
  export function processVendorsAndTokensResponse(response: any, selectedMarketName?: string): 
  {
    vendors: VendorModel[];
    tokens: TokenFieldModel[];
    fees: MarketFeeModel[];
  } {

    if (!response?.data) {
      return { vendors: [], tokens: [GrossProfitTokenModel], fees: [] };
    }
  
    const data = response.data;
  
    const vendors: VendorModel[] = data.vendors ?? [];
    if (vendors.length === 0) {
      console.warn("NO VENDORS FOUND FOR: ", selectedMarketName);
    }
  
    const tokens: TokenFieldModel[] = [
      GrossProfitTokenModel,
      ...(data.tokens?.map((token: MarketTokensModel) => ({ quantity: 0,  Token: token,
      })) ?? []),
    ];
    if (tokens.length === 1) {
      console.warn("NO TOKENS FOUND FOR: ", selectedMarketName);
    }
  
    const fees: MarketFeeModel[] = data.fees ?? [];
    if (fees.length === 0) {
      console.warn("NO FEES FOUND FOR: ", selectedMarketName);
    }
  
    return { vendors, tokens, fees };
  }
  
  export function processSubmissionResponse(response: any): string {
    if (response !== undefined) {
      return "Data Sent Successfully";
    }
    return "Submission failed";
  }