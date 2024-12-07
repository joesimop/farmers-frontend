import { AxiosResponse } from "axios";
import { axiosInstance } from "../../lib/API/APIDefinitions";
import { TokenType, VendorType } from "@lib/Constants/Types";

export interface ReportingOption {
    market_id: number; // UUID represented as a number
    market_name: string; // Market name
    market_dates: string[]; // Array of dates
}

export interface TokenReport {
    type: TokenType,
    count: number
    per_dollar_value: number
}

export interface VendorReport {
    id: string; // UUID as a string
    vendor_name: string; // Name of the vendor
    vendor_type: VendorType;
    reported_gross: number; // Decimal value, represented as a number
    fees_paid: number; // Decimal value, represented as a number
    market_date: Date; // Date object
    tokens: TokenReport[]; // Array of Token objects
}

export interface VendorTotals {
    fees_paid: number,
    tokens: TokenReport[]
}

export interface CompleteVendorReport {
    reports: VendorReport[],
    totals: VendorTotals
}

export const GetReportingOptions = async (MarketManager: number): Promise<AxiosResponse<ReportingOption[]>> => {

    const urlString = `/market_manager/${MarketManager}/reporting/options`;
    return axiosInstance.get<ReportingOption[]>(urlString);

  };

export const GetVendorReport = async ( MarketManager: number, MarketID: number, MarketDate: string): Promise<AxiosResponse<CompleteVendorReport>> => {
    
    const MarketIDString = "market_id=" + MarketID + "&";
    const MarketDateString = MarketDate === "" ? "" : "market_date=" + MarketDate + "&";
    const urlString = `market_manager/${MarketManager}/reporting/report?${MarketIDString}${MarketDateString}sort_by=MARKET_DATE&sort_direction=DESC`

    return axiosInstance.get<CompleteVendorReport>(urlString);
}