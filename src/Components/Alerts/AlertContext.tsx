import { ReactNode, createContext, useState, useContext } from 'react';
import { AlertDataModel } from '../../lib/Constants/DataModels';
import { alerttype } from '../../lib/Constants/Types';

interface AlertContextModel {   
    alert: AlertDataModel;
    sendErrorAlert: Function;
    sendInfoAlert: Function;
    sendSuccessAlert: Function;
    sendWarningAlert: Function;
    hideAlert: Function;
    APIAlerts: {
        sendResponseErrorAlert: Function;
        sendResponseSuccessAlert: Function;
    }
}
// Define a type for the provider's props
interface AlertProviderProps {
    children: ReactNode;
  }

const defaultAlertData: AlertDataModel = {message: '', type: "info", visible: false}

const defaultAlertContextData: AlertContextModel = {
    alert: defaultAlertData, 
    sendErrorAlert:     ()=>{}, 
    sendInfoAlert:      ()=>{}, 
    sendSuccessAlert:   ()=>{}, 
    sendWarningAlert:   ()=>{},
    hideAlert:          ()=>{},
    APIAlerts: {
        sendResponseErrorAlert:     ()=>{}, 
        sendResponseSuccessAlert:   ()=>{}
    }};

// Create the Alert Context
const AlertContext = createContext(defaultAlertContextData);

// AlertProvider component to wrap around the app
export const AlertProvider = ({children} : AlertProviderProps) => {
  const [alert, setAlert] = useState(defaultAlertData);

  // Function to show the alert
  const showAlert = (message: string, type: alerttype, duration?:number) => {
    setAlert({
      message,
      type,
      visible: true,
    });

    setTimeout(hideAlert, 5000);
  };

  // Function to hide the alert
  const hideAlert = (interval?: NodeJS.Timer) => {
    
    if(interval) clearInterval(interval);
    
    setAlert(() => ({
      message: alert.message,
      type: alert.type,
      visible: false,
    }));
  };

  const sendErrorAlert      = (message: string)    => { showAlert(message, "error"); }
  const sendInfoAlert       = (message: string)    => { showAlert(message, "info"); }
  const sendSuccessAlert    = (message: string)    => { showAlert(message, "success"); }
  const sendWarningAlert    = (message: string)    => { showAlert(message, "warning"); }

  const sendResponseErrorAlert = (message: string, status: number)      => { sendErrorAlert(`${status}: ${message}`); }
  const sendResponseSuccessAlert = (message: string, status: number)    => { sendSuccessAlert(`${status}: ${message}`); }

  const APIAlerts = {sendResponseErrorAlert, sendResponseSuccessAlert}

  return (
    <AlertContext.Provider value={{
        alert, 
        sendErrorAlert, 
        sendSuccessAlert, 
        sendInfoAlert,
        hideAlert,
        sendWarningAlert,
        APIAlerts }}>

      {children}
    </AlertContext.Provider>
  );
};

// Custom hook to use the AlertContext
export const useAlert = () => useContext(AlertContext);
