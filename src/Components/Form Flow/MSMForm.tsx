// FormGroup.tsx
import React, { useContext, useEffect } from 'react';
import { FormSection } from './FormSection';
import { useMSMFormStore } from './MSMFormState';
import { initSectionState, resetMSMForm } from './MSMFormStateFunctions';

interface MSMFormContext{
  isAuto: boolean
}


// Protects when using Form Context
export const useFormContext = () => {
  const context = useContext(MSMFormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a MSMForm provider');
  }
  return context;
};

const MSMFormContext = React.createContext<MSMFormContext | undefined>(undefined);

interface MSMFormProps {
  children: React.ReactNode;
  isAuto?: boolean | false
}

//Assumes only one form group per page
export const MSMForm: React.FC<MSMFormProps> = ({ children, isAuto }) => {

  // Collects section keys from children
  const buildSectionKeys = (children: React.ReactNode): string[] => {

    const sectionKeys: string[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type == FormSection) {
        sectionKeys.push(child.props.sectionKey);
      } else {
        throw new Error('All children of a MSMForm must be of type FormSection');
    }});
    return sectionKeys;
  }
  //Constructor for the form group
  useEffect(() => {
    if(isAuto){
      console.log("CALLING THIS")
      const sectionKeys = buildSectionKeys(children);
      initSectionState(sectionKeys)
    }
    return () => {
      resetMSMForm()
    };
  }, []);

  return (
    <MSMFormContext.Provider value={{ isAuto: isAuto??false }}>{
      children 
    }</MSMFormContext.Provider>
  );
};

export default MSMForm;