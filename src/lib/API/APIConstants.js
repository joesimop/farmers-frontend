export const RESPONSE_CODES = {
  
  //Sucess Codes
  SUCCESSFUL_PROCESS_REQUEST:   200,
  SUCCESSFUL_CREATE_REQUEST:    201,

  //Error Codes
  INVALID_JSON:                 400,
  UNAUTHORIZED:                 401,
  UNPROCESSABLE_ENTITY:         422,  /* unexpected vlaue for {field} */
  DATABASE_ERROR:               500   /*Internal Server Error*/
};

export const URL_CONFIG = {

  LOCAL_SERVER: "http://localhost:8000/"

}

export const API_ENDPOINTS = {

  POPULATE_CHECKOUT: 'market_manager/market_manager_id/checkout'

}