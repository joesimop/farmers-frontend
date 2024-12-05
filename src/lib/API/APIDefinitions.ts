// api/axiosInstance.ts
import axios, { HttpStatusCode } from 'axios';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { isEmptyList } from '../../Helpers';

export const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Replace with your API's base URL
  timeout: 10000, // Optional timeout in milliseconds
  headers: { 'Content-Type': 'application/json' }, // Optional headers
});


export enum APIResultState{
    NOT_SENT,
    LOADING,
    SUCCESS,
    FAILED,
    NO_DATA
}

export interface APIResult<T>{
    data: T | null
    state: APIResultState
    status: HttpStatusCode
}


export const handleApiResponse = <T>(response: AxiosResponse): APIResult<T> => {
    // Check if status is a success code
    if (response.status >= 200 && response.status < 300) {
      return {
        data: response.data,
        status: response.status,
        state: APIResultState.SUCCESS
      };
    }
  
    // If status is not a success code, treat it as an error
    throw new Error(`Unexpected status code: ${response.status}`);
  };

// Function to handle errors from Axios
export const handleApiError = <T>(error: any): APIResult<T> => {
    return {
      data: null,
      status: error.statusCode,
      state: APIResultState.FAILED
    };
  };


export const isAPIResponse = <T>(error: unknown): error is APIResult<T> => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      'status' in error &&
      typeof (error as APIResult<T>).status === 'number'
    );
};

export const getAPIResponseData = async <T>(promise: Promise<APIResult<T>>): Promise<T | null> => {
    try {
      const response = await promise;
      return response.data; // Return the resolved data
    } catch (error) {
      return null; // Return null on error
    }
  };

type SuccessCallback<T> = (data: T, statusCode?: HttpStatusCode) => void;
type ErrorCallback = (error: HttpStatusCode) => void;

type CallEndpointArgs<T> = {
    endpointCall: Promise<AxiosResponse<T>>; // The API call to execute
    onSuccess?: SuccessCallback<T>; // Callback for successful responses
    onError?: ErrorCallback; // Optional callback for errors
  };

export const callEndpoint = async <T>({
    endpointCall,
    onSuccess,
    onError,
  }: CallEndpointArgs<T>) => {
    try {
      const response = await endpointCall;
      const apiResponse = handleApiResponse<T>(response);

      if (apiResponse.data && onSuccess) {
        onSuccess(apiResponse.data, apiResponse.status);
      } else if (onError) {
        onError(apiResponse.status);
      }
    } catch (error) {
      const apiError = handleApiError(error);
      if (onError) {
        onError(apiError.status);
      }
    }
};


type StateSetter<T> = Dispatch<SetStateAction<T>>;

type ReactStateCallEndpointArgs<T> = CallEndpointArgs<T> & {
  setState?: StateSetter<APIResult<T>>;
};

export const callEndpointWithState = async <T>({
  endpointCall,
  onSuccess,
  setState,
  onError,
}: ReactStateCallEndpointArgs<T>) => {
    // Set the state to a loading state before making the API call
    setState?.((prevState) => ({
        ...prevState,
        state: APIResultState.LOADING,
    }));
    
    await callEndpoint<T>({
        endpointCall,
        onSuccess: (data, statusCode) => {

            //If we got not data back
            if (isEmptyList(data)){
                setState?.({
                    data: data,
                    state: APIResultState.NO_DATA,
                    status: statusCode ?? HttpStatusCode.NoContent
                }); 
                
            // Otherwise, we have valid data
            } else {
                setState?.({
                    data: data,
                    state: APIResultState.SUCCESS,
                    status: statusCode ?? HttpStatusCode.Ok
                  }); 
          
                  if (onSuccess){
                      onSuccess(data)
                  }
            }
        },
        onError: (error) => {
          setState?.({
            data: null,
            state: APIResultState.FAILED,
            status: error
          });
          if (onError) {
            onError(error);
          }
        },
      });
};

// DefaultApiResult factory
export const DefaultApiResult = <T>(): APIResult<T> => ({
    data: null,
    state: APIResultState.NOT_SENT, 
    status: HttpStatusCode.Ok
  });


  