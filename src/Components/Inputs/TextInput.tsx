import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useFormControl } from "../Form Flow/useFormControl";
import { nextMSMFormField, setFieldValidationState } from '../Form Flow/MSMFormStateFunctions';
import { isFieldValid, ErrorState, FieldValue, isModified } from '../../lib/Constants/Types';
import { validate } from "uuid";


interface TextInputProps {
  label: string;
  formKey: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  validationFunction?: (value: string | null) => string | null; 
  validateInput?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ 
    label, 
    formKey, 
    defaultValue = "", 
    onChange = undefined,
    onEnter = undefined,
    validationFunction = undefined,
    validateInput = false}) => {
  
    
    const [value, setValue] = useState<string>(defaultValue);   //Holds the currently entered value
    const [error, setError] = useState<ErrorState>(null);       //Holds the error state if there is one

    //HTML Reference for form control
    const inputRef = useFormControl(formKey);

    //Validation used if no function is provided
    const defaultValidation = (value: string): ErrorState => {
        
        if (!value || value == "") {
            return "Field requires text input";
        }
        return null;
    }

    //Chooses either provided funciton or uses default if not provided
    const validateFieldValue = (value: string): ErrorState => {

        if(validationFunction){
            return validationFunction(value)
        }
        return defaultValidation(value)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue)

        if(onChange != undefined){
            onChange(newValue)
        }
    };

    const onExit = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key == 'Enter' || e.key == 'Tab'){
            if(onEnter != undefined){
                onEnter(value);
            }
            nextMSMFormField();
        }
    }

    // Validate only when the field loses focus
    const handleBlur = () => {
        const newErrorState = validateFieldValue(value);
        setError(newErrorState);
        setFieldValidationState(formKey, isFieldValid(newErrorState));
        nextMSMFormField();
      };



    return (
        <div className="form-margin" style= {{}}>
        <TextField
            key={label}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => onExit(event)}
            label={label}
            variant="standard"
            inputRef={inputRef}
            onBlur={handleBlur}
            fullWidth
            error={!isFieldValid(error)}
            helperText={error}
        />
        </div>
  );
};

export default TextInput;
