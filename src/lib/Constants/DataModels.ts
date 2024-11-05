import { alerttype, vendortype, feetype, fieldstatus } from "./Types";

export interface MarketFeeModel {
    vendor_type: vendortype,
    fee_type: feetype,
    flat: number,
    percent: number,
}

export interface VendorModel { 
    vendor_id: number;
    market_vendor_id: number;
    business_name: string; 
    cpc_expr: string;
    current_cpc: string;
    type: vendortype;
  }

export interface TokenSubmissionModel {
    market_token_id: number,
    count: number
}

export interface CheckoutModel {  
    market_vendor_id: number | undefined,
    market_date: string | undefined, /* YYYY-MM-DD */
    reported_gross: number,
    fees_paid: number,
    tokens:TokenSubmissionModel[]
}

export interface MarketTokensModel {
    id: number,
    type: string,
    per_dollar_value: number
}

export interface MarketCheckoutDataModel {
    market_id: number,
    market_name: string,
    market_dates: string,
}

export interface FieldControlModel {
    fieldStatus: fieldstatus,
    input_label: string
}


export interface AlertDataModel {   
    message: string;
    type: alerttype;
    visible: boolean;
}