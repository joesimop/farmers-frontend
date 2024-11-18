// api/axiosInstance.ts
import axios, { HttpStatusCode } from 'axios';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';

export const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Replace with your API's base URL
  timeout: 10000, // Optional timeout in milliseconds
  headers: { 'Content-Type': 'application/json' }, // Optional headers
});

export const enum APISuccess {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
}

export const enum APIError{
    UNKNOWN = 1000,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

export type HTTPStatusCode = APISuccess | APIError

export type APIResult<T> = T | null

export interface APIResponse<T> {
    data: APIResult<T>;
    status: HTTPStatusCode;
}

export const handleApiResponse = <T>(response: AxiosResponse): APIResponse<T> => {
    // Check if status is a success code
    if (response.status as APISuccess) {
      return {
        data: response.data,
        status: response.status as APISuccess,
      };
    }
  
    // If status is not a success code, treat it as an error
    throw new Error(`Unexpected status code: ${response.status}`);
  };

// Function to handle errors from Axios
export const handleApiError = <T>(error: any): APIResponse<T> => {
    const status = (error.response?.status as HTTPStatusCode) || APIError.INTERNAL_SERVER_ERROR;
    return {
      data: null,
      status,
    };
  };


export const isAPIResponse = <T>(error: unknown): error is APIResponse<T> => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      'status' in error &&
      typeof (error as APIResponse<T>).status === 'number'
    );
};

export const getAPIResponseData = async <T>(promise: Promise<APIResponse<T>>): Promise<APIResult<T>> => {
    try {
      const response = await promise;
      return response.data; // Return the resolved data
    } catch (error) {
      return null; // Return null on error
    }
  };

type SuccessCallback<T> = (data: T, statusCode?: HTTPStatusCode) => void;
type ErrorCallback = (error: HTTPStatusCode) => void;

type CallEndpointArgs<T> = {
    endpointCall: Promise<AxiosResponse<T>>; // The API call to execute
    onSuccess: SuccessCallback<T>; // Callback for successful responses
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

      if (apiResponse.data) {
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

  