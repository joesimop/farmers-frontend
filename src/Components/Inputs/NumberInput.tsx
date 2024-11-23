import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useFormControl } from "../Form Flow/useFormControl";
import { nextMSMFormField, setFieldValidationState } from '../Form Flow/MSMFormStateFunctions';
import { isFieldValid, ErrorState, FieldValue, isModified } from '../../lib/Constants/Types';


interface NumberInputProps {
  label: string;
  formKey: string;
  defaultValue?: number;
  onEnter?: (value: number) => void;
  onChange: (value: number) => void;
  validationFunction?: (value: number | null) => string | null; 
  useValidation?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
    label, 
    formKey, 
    defaultValue = 0, 
    onEnter = undefined,
    onChange,
    validationFunction = undefined,
    useValidation = false,
}) => {
  
    const [value, setValue] = useState<number>(defaultValue);
    const [error, setError] = useState<ErrorState>(null)

    const inputRef = useFormControl(formKey);

    const defaultValidation = (value: number): ErrorState => {
        if (value < 0) { return "Value must be greater than zero."}
        return null
    }

    const validateValue = (value: number): ErrorState => {
        if(validationFunction) {
            return validateValue(value)
        }
        return defaultValidation(value)
        
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        setValue(newValue)
        onChange(newValue)
    };

    const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key == 'Enter'){
            onEnter?.(value);
            nextMSMFormField();
        }
    }

    //Validate field when value changes
    useEffect(() => {
        if (useValidation || validationFunction) {
            const newErrorState = validateValue(value)
            setError(newErrorState)
            setFieldValidationState(formKey, isFieldValid(newErrorState))
        }
    }, [value])

    return (
        <div className="form-margin" style= {{}}>
        <TextField
            key={label}
            value={value}
            type = "number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => keyPress(event)}
            label={label}
            variant="standard"
            inputRef={inputRef}
            fullWidth
            error={!isFieldValid(error)}
            helperText={error}
        />
        </div>
    );
};

export default NumberInput;
