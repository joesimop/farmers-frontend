import { URL_CONFIG } from "./APIConstants";
import axios from "axios";
import { CheckoutModel } from "../Constants/DataModels";
/*
Naming Convention:

DB_Get_Checkout
DB_Submit_Checkout
DB_Update_Checkout
DB_Delete_Checkout

*/
const curUrl = URL_CONFIG.LOCAL_SERVER;

const OptParamIsValid:Function = (OptionalParameter:any):boolean => { return typeof OptionalParameter !== 'undefined'; };

export interface ResponseHandlingFunction {
    (Data: any, Status: number): any
}

export interface DBResHandlers {
    OnSuccess?:ResponseHandlingFunction, 
    OnError?:ResponseHandlingFunction, 
    OnFinally?:Function
};

const AxiosGet: Function = (Endpoint:string, DBHandlers?: DBResHandlers, WithCredentials?:boolean) => {

    if(Endpoint.length >= 0)
    {
        axios.get(Endpoint, { withCredentials: WithCredentials }
        ).then(function (response) 
        {
            if( typeof DBHandlers !== 'undefined' && 
                typeof DBHandlers.OnSuccess !== 'undefined') 
                { 
                    DBHandlers.OnSuccess(response, response.status); 
                };

        }).catch(function(error)
        {
            console.error(error);
            if( typeof DBHandlers !== 'undefined' && 
                typeof DBHandlers.OnError !== 'undefined') 
                { 
                    DBHandlers.OnError(error.response, error.status) 
                };

        }).finally(function ()
        {
            if( typeof DBHandlers !== 'undefined' && 
                typeof DBHandlers.OnFinally !== 'undefined') 
                { 
                    DBHandlers.OnFinally() 
                };
        });
    }
};

const AxiosPost: Function = ( Endpoint:string, Data: any, DBHandlers?: DBResHandlers, WithCredentials?:boolean ) => {

    if(Endpoint.length >= 0)
    {
        console.log(Data)
        axios.post(Endpoint, Data, { withCredentials: WithCredentials }
        ).then(function (response) 
        {
            if( typeof DBHandlers !== 'undefined' && 
                typeof DBHandlers.OnSuccess !== 'undefined') 
                { 
                    DBHandlers.OnSuccess(response, response.status); 
                };

        }).catch(function(error)
        {
            console.error(error);

            if( typeof DBHandlers !== 'undefined' && 
                typeof DBHandlers.OnError !== 'undefined') 
                { 
                    DBHandlers.OnError(error, error.status) 
                };

        }).finally(function ()
        {
            if( typeof DBHandlers !== 'undefined' && 
                typeof DBHandlers.OnFinally !== 'undefined') 
                { 
                    DBHandlers.OnFinally() 
                };
        });
    }
};

export const DB_GetCheckoutInfoForManager: Function = ( MarketManager: number, DBHandlers?: DBResHandlers ) => {

    //Construct Endpoint
    let endpoint: string = `${curUrl}market_manager/${MarketManager}/checkout/market_date_options`;

    //Call Endpoint
    AxiosGet(endpoint, DBHandlers);
};

export const DB_GetVendorTokensFeesForMarket = ( MarketManager: number, MarketID:number, MarketDate?:string, DBHandlers?: DBResHandlers ) => {

    let MarketDateParam = OptParamIsValid(MarketDate) ? MarketDate : "";

    //Construct Endpoint
    let endpoint: string = `${curUrl}market_manager/${MarketManager}/checkout/market_details/${MarketID}?market_date=${MarketDateParam}`;

    //Call Endpoint
    AxiosGet(endpoint, DBHandlers);
};

export const DB_GetVendorsForMarketManger = ( MarketManager: number, DBHandlers?: DBResHandlers) => {

    let endpoint = `${curUrl}market_manager/${MarketManager}/vendors_per_market`;
    AxiosGet(endpoint,DBHandlers);

}

export const DB_GetReportingOptions = ( MarketManager: number, DBHandlers?: DBResHandlers) => {

    let endpoint = `${curUrl}market_manager/${MarketManager}/reporting/options`;
    AxiosGet(endpoint,DBHandlers);

}

export const DB_GetReports = ( MarketManager: number, MarketID: number | undefined, MarketDate: string, DBHandlers?: DBResHandlers ) => {


    let MarketIDString = MarketID === undefined ? "" : "market_id=" + MarketID + "&";
    let MarketDateString = MarketDate === "" ? "" : "market_date=" + MarketDate + "&";

    let endpoint = `${curUrl}market_manager/${MarketManager}/reporting/report?${MarketIDString}${MarketDateString}sort_by=MARKET_DATE&sort_direction=DESC`;
    AxiosGet(endpoint,DBHandlers);
}

export const DB_SubmitCheckout = ( MarketManager: number, Data: CheckoutModel, DBHandlers?: DBResHandlers) => {

    //Construct Endpoint
    let endpoint: string = `${curUrl}market_manager/${MarketManager}/checkout/submit/`;
    AxiosPost(endpoint, Data, DBHandlers, false);

}
