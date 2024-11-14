// FormGroup.tsx
import React, { useEffect, useContext, useState } from 'react';
import { useMSMFormStore } from './MSMFormState';
import { useFormContext } from './MSMForm';
import "../../index.css";


// Form Section Context
export interface FormSectionContext {
    sectionKey: string;
    isAuto: boolean
}

// Protects when using Form Context
export const useFormSectionContext = () => {
    const context = useContext(FormSectionContext);
    if (!context) {
        throw new Error('useFormSectionContext must be used within a FormSection provider');
    }
    return context;
};

const FormSectionContext = React.createContext<FormSectionContext | undefined>(undefined);

//Form Section Props
interface FormSectionProps {
  children: React.ReactNode;
  sectionKey: string;
  isNested?: boolean | false;
  disableOnReset?: boolean | true;
}


//Assumes only one form group per page
export const FormSection: React.FC<FormSectionProps> = ({ children, sectionKey, isNested, disableOnReset }) => {

    const { isAuto } = useFormContext();

    const [disabled, setDisabled] = useState(isAuto);

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

    //Builds Keys for state
    const buildFieldKeys = (children: React.ReactNode): string[] => {
    const fieldKeys: string[] = [];

    //If children are nested, recursively build the field keys
    if(isNested) {
        return buildFieldKeysRecursive(children);
    } 

    //Check if the children are valid and have a formkey prop
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.formKey) {
        fieldKeys.push(child.props.formKey);
      } else {
        throw new Error('All children of a FormGroup must have a formkey prop');
    }});

    return fieldKeys;
    }

  //Subscribe to hear for section changes, need to resub if children change.
  useEffect(() => {

    if (isAuto){
      // Subscribe to the Zustand Section Changes
    const unsubscribe = useMSMFormStore.subscribe(
      (state) => state.activeSectionIndex,
      (activeSectionIndex) => {

        const activeSectionKey = useMSMFormStore.getState().sectionKeys[activeSectionIndex];
        const isActiveSection =  activeSectionKey === sectionKey;
        

        // Activates section for filling out
        if (isActiveSection) {
          const fieldKeys = buildFieldKeys(children);
          useMSMFormStore.getState().initFocusManager(fieldKeys);
          setDisabled(false);
        } else {
          console.log(disabled)

          // If we are not the active section, and the index has been set back to 0,
          // we have been reset. Disables the form if disableOnReset is set.
          if(!disabled && activeSectionIndex == 0 && disableOnReset){
              setDisabled(true);
          }
        }
    });

    // Cleanup the Zustand subscription on component unmount
    return unsubscribe;
    }
    
  }, [children]);

  return (
    <div className={disabled ? "disabled" : ""}>{
        <FormSectionContext.Provider value={{ sectionKey: sectionKey, isAuto: isAuto }}>
           {children} 
        </FormSectionContext.Provider>
    }</div>
  );
};

export default FormSection;