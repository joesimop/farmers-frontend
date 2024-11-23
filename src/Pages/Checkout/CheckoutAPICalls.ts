import { AxiosResponse } from "axios";
import { axiosInstance } from "../../lib/API/APIDefinitions";
import { Vendor, MarketFee, MarketToken } from "../../lib/Constants/DataModels";
import { Dayjs } from "dayjs";


export interface CheckoutOption {
    market_id: number;
    market_name: string;
    market_dates: string[]; 
}

export interface CheckoutData {
    vendors: Vendor[];
    market_fees: MarketFee[];
    market_tokens: MarketToken[];
  }

  export interface TokenSubmit {
    market_token_id: number,
    count: number
}
  export interface CheckoutSubmit {  
    market_vendor_id: number,
    market_date: string, /* YYYY-MM-DD */
    reported_gross: number,
    fees_paid: number,
    tokens: TokenSubmit[]
}

export const GetCheckoutOptions = async (MarketManager: number): Promise<AxiosResponse<CheckoutOption[]>> => {

    const urlString: string = `/market_manager/${MarketManager}/checkout/market_date_options`;
    return axiosInstance.get<CheckoutOption[]>(urlString)

};

export const GetCheckoutData = async (MarketManager: number, MarketID:number, MarketDate?:Dayjs): Promise<AxiosResponse<CheckoutData>> => {

    const MarketDateParam = MarketDate === undefined ? "" : MarketDate.format("YYYY-MM-DD");
    const urlString = `/market_manager/${MarketManager}/checkout/market_details/${MarketID}?market_date=${MarketDateParam}`;
    return axiosInstance.get<CheckoutData>(urlString)

};

export const SubmitCheckout = ( MarketManager: number, Data: CheckoutSubmit): Promise<AxiosResponse> => {

    let urlString: string = `/market_manager/${MarketManager}/checkout/submit/`;
    return axiosInstance.post(urlString, Data);

}