import { AxiosResponse } from "axios";
import { axiosInstance } from "../../lib/API/APIDefinitions";

export interface ReportingOption {
    market_id: number; // UUID represented as a number
    market_name: string; // Market name
    market_dates: string[]; // Array of dates
}

export interface TokenReport {
    type: string,
    count: number
}

export interface VendorReport {
    id: string; // UUID as a string
    vendor_name: string; // Name of the vendor
    reported_gross: number; // Decimal value, represented as a number
    fees_paid: number; // Decimal value, represented as a number
    market_date: Date; // Date object
    tokens: TokenReport[]; // Array of Token objects
}

export const GetReportingOptions = async (MarketManager: number): Promise<AxiosResponse<ReportingOption[]>> => {

    const urlString = `/market_manager/${MarketManager}/reporting/options`;
    return axiosInstance.get<ReportingOption[]>(urlString);

  };

export const GetVendorReport = async ( MarketManager: number, MarketID: number | undefined, MarketDate: string): Promise<AxiosResponse<VendorReport[]>> => {
    
    const MarketIDString = MarketID === undefined ? "" : "market_id=" + MarketID + "&";
    const MarketDateString = MarketDate === "" ? "" : "market_date=" + MarketDate + "&";
    const urlString = `market_manager/${MarketManager}/reporting/report?${MarketIDString}${MarketDateString}sort_by=MARKET_DATE&sort_direction=DESC`

    return axiosInstance.get<VendorReport[]>(urlString);
}