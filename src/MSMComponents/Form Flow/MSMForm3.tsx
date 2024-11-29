// FormGroup.tsx
import React, { useContext, useEffect } from 'react';
import { FormSection } from './FormSection';
import FormData from './FormData';
import { initSectionState, resetMSMForm, isFormValid, initFieldState, getValidationStates } from './MSMFormStateFunctions';
import ActionButton from '../Buttons/ActionButton';
import { DisplayAlert } from '../Popups/PopupHelpers';
import { FieldState } from '../../lib/Constants/Types';

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
  onSubmit?: () => void;
  ButtonText?: string;
}

//Assumes only one form group per page
export const MSMForm3: React.FC<MSMFormProps> = ({ children, isAuto, onSubmit = undefined, ButtonText="Submit" }) => {

  //Builds Section Keys for state when they are nested
  const buildFieldKeysRecursive = (children: React.ReactNode): string[] => {

    const fieldKeys: string[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if(child.props.formKey) {
          fieldKeys.push(child.props.formKey);
        } else {
          fieldKeys.push(...buildFieldKeysRecursive(React.Children.toArray(child.props.children)));
        }
      }});

    return fieldKeys;
}

  // Collects section keys from children
  const buildSectionKeys = (children: React.ReactNode): string[] => {

    const sectionKeys: string[] = [];
    React.Children.forEach(children, (child) => {
      if(React.isValidElement(child)) {
        if (child.type == FormSection) {
          sectionKeys.push(child.props.sectionKey);
        } else if (child.type == FormData) {
          return;
        } else{
          throw new Error('All children of a MSMForm must be of type FormSection or FormData');
        }
    }
  });

    return sectionKeys;
  }

  const onSubmitButtonClick = (): void => {

    const fields = getValidationStates()

    console.log(fields)

    //If form isn't valid, according to our zustand state, display error.
    if(!isFormValid()){
      DisplayAlert('error', "Form is not valid. Please complete it to submit.")
      return;
    }
    //Submit form
    onSubmit?.()
  }


  //Constructs the form sections
  useEffect(() => {

    //We build form-key sections progressively if its auto
    if(isAuto){
      const sectionKeys = buildSectionKeys(children);
      initSectionState(sectionKeys)
    }

    return () => {
      resetMSMForm()
    };
  }, []);

  return (
    <>
    <MSMFormContext.Provider value={{ isAuto: isAuto??false }}>
      { children } 
    </MSMFormContext.Provider>

    {onSubmit &&
      <div className='form-margin'>
            <ActionButton text={ButtonText} onClick={onSubmitButtonClick} />
      </div>
    }
   

    </>
  );
};

export default MSMForm3;