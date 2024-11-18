import { AxiosResponse } from "axios";
import { axiosInstance } from "../../lib/API/APIDefinitions";
import { Vendor } from "../../lib/Constants/DataModels";


export interface MarketVendor {
    market: string;
    vendors: Vendor[];
}

export const GetMarketVendors = async ( MarketManager: number): Promise<AxiosResponse<MarketVendor[]>> => {

    let urlString = `/market_manager/${MarketManager}/vendors_per_market`;
    return axiosInstance.get<MarketVendor[]>(urlString);

}