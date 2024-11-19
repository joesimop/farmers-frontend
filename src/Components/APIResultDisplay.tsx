import React from 'react';
import { APIResult, APIResultState} from '../lib/API/APIDefinitions'; // Adjust import as needed
import CircularProgress from '@mui/material/CircularProgress';
import { HttpStatusCode } from 'axios';

// Utility type to check if T is an array type
type IsArray<T> = T extends Array<any> ? true : false;

interface APIResultDisplayProps<T> {
    result: APIResult<T>;
    children: (data: T) => React.ReactNode; // Children as a function for the success case
    renderError?: (error: HttpStatusCode) => React.ReactNode; // Optional function to render on error
    displayAlways? : boolean 
}
  
const APIResultDisplay = <T,>({ result, children, renderError, displayAlways = false }: APIResultDisplayProps<T>): React.ReactElement => {

    if (result.state == APIResultState.FAILED) {

        const errorCode = result.status ?? HttpStatusCode.NotImplemented;
        const errorContent = renderError ? renderError(errorCode) : <p>Error: {errorCode || 'Unknown Error'}</p>;
        return <>{errorContent}</>;
    }

    if (result.state === APIResultState.LOADING){
        return <CircularProgress />
    }
  
    if (result.data) {
      return <>{children(result.data)}</>;
    }

    return <></>
  };
  

export default APIResultDisplay;
