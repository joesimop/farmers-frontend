import { RESPONSE_CODES, URL_CONFIG } from "./APIConstants";
import axios from "axios";

const curUrl = URL_CONFIG.LOCAL_SERVER;

const OptParamIsValid:Function = (OptionalParameter:any):boolean =>
    {
        return typeof OptionalParameter !== 'undefined';
};

export interface ResponseHandlingFunction {
    (Data: any, Status: number): any
}

export interface APIResponseHandlingFunctions {
    OnSuccess?:ResponseHandlingFunction, 
    OnError?:ResponseHandlingFunction, 
    OnFinally?:Function
};

const AxiosGet: Function = (
    Endpoint:string, 
    ResponseHandlers?: APIResponseHandlingFunctions,
    WithCredentials?:boolean
) => {

    if(Endpoint.length >= 0)
    {
        console.log(ResponseHandlers)
        axios.get(Endpoint, { withCredentials: WithCredentials }
        ).then(function (response) 
        {
            console.log(response);
            if( typeof ResponseHandlers !== 'undefined' && 
                typeof ResponseHandlers.OnSuccess !== 'undefined') 
                { 
                    ResponseHandlers.OnSuccess(response.data, response.status); 
                };

        }).catch(function(error)
        {
            console.error(error);

            if( typeof ResponseHandlers !== 'undefined' && 
                typeof ResponseHandlers.OnError !== 'undefined') 
                { 
                    ResponseHandlers.OnError(error.response.data, error.status) 
                };

        }).finally(function ()
        {
            if( typeof ResponseHandlers !== 'undefined' && 
                typeof ResponseHandlers.OnFinally !== 'undefined') 
                { 
                    ResponseHandlers.OnFinally() 
                };
        });
    }
};

export const GetCheckoutInfoForManager: Function = (

    MarketManager: number,
    ResponseHandlers?: APIResponseHandlingFunctions
) => {

    //Construct Endpoint
    let endpoint: string = `${curUrl}market_manager/${MarketManager}/checkout`;

    //Call Endpoint
    AxiosGet(endpoint, ResponseHandlers);
};

/**
 * CANNOT CURRENTLY CALL BECAUSE ENDPOINT IT FORMATED IN CORRECTLY
 * @param MarketManager 
 * @param MarketID 
 * @param MarketDate 
 * @param ResponseHandlers 
 */
export const GetCheckoutInitInfo: Function = (

    MarketManager: number,
    MarketID:number,
    MarketDate?:string,
    ResponseHandlers?: APIResponseHandlingFunctions
) => {

    let MarketDateParam = OptParamIsValid(MarketDate) ? MarketDate : "";

    //Construct Endpoint
    let endpoint: string = `${curUrl}market_manager/${MarketManager}/checkout/${MarketID}}/?market_date=${MarketDateParam}`;

    //Call Endpoint
    AxiosGet(endpoint, ResponseHandlers);
};
