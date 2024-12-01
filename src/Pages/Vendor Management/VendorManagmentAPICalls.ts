import { AxiosResponse } from "axios";
import { axiosInstance } from "../../lib/API/APIDefinitions";
import { MarketOption, Vendor } from "../../lib/Constants/DataModels";


export interface MarketVendor {
    market: string;
    vendors: Vendor[];
}

export const GetMarketVendors = async ( MarketManager: number, MarketId: number): Promise<AxiosResponse<MarketVendor[]>> => {

    const MarketIdString = "market_id=" + MarketId 
    let urlString = `/market_manager/${MarketManager}/vendors?${MarketIdString}`;
    return axiosInstance.get<MarketVendor[]>(urlString);

}

export const GetMarketsOptions = async ( MarketManager: number): Promise<AxiosResponse<MarketOption[]>> => {

    let urlString = `/market_manager/${MarketManager}/market_options`;
    return axiosInstance.get<MarketOption[]>(urlString);

}
