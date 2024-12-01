import { alerttype, fieldstatus } from "./Types";

export interface Vendor {
    id: number;
    market_vendor_id: number;
    business_name: string;
    current_cpc: string;
    cpc_expr: Date;
    type: string;
}

export interface MarketOption {
    market: string;
    market_id: number;
}
  
export interface MarketFee {
    vendor_type: string;
    fee_type: string;
    flat: number;
    percent: number;
}
  
export interface MarketToken {
    id: number;
    type: string;
    per_dollar_value: number;
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