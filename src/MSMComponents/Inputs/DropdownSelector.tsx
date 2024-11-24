import React, { useContext, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useFormControl } from '../Form Flow/useFormControl';
import {ButtonProps as MUIButtonProps} from '@mui/material/Button';
import { nextMSMFormField, setFieldValidationState } from '../Form Flow/MSMFormStateFunctions';


interface DropdownSelectorProps {
    options: string[];
    defaultValue: string;
    formKey: string;
    onChanged: (value: string) => void;
    includeNone?: boolean;
    sx?: MUIButtonProps['sx'];
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({ options, formKey, defaultValue, includeNone = false, onChanged, sx }) => {
   
    // Initialize the selected value
    const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue);

    //Get the section this form is in and subscribe to the Zustand store
    const inputRef = useFormControl(formKey);

    
    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedValue(value);
        onChanged(value);
        nextMSMFormField();
        setFieldValidationState(formKey, true)  //If change is called, must have value.
    };

    // Automatically set value to first choice when options changes.
    // Need the last conditional to ensure we are not incurring sets
    // when setSelectedValue is called.
    useEffect(() => {
        
        if (options && options.length > 0 && !options.includes(selectedValue)) {
            setSelectedValue(options[0]);
            setFieldValidationState(formKey, true)
        }

    }, [options]);

    return (
        <div className="form-margin">
            <FormControl sx={{...sx}} fullWidth={true}>
                <InputLabel id="dropdown-selector-label">{formKey}</InputLabel>
                <Select
                    sx={{ textAlign: "left"}}
                    variant="standard"
                    labelId="dropdown-selector-label"
                    value={selectedValue}
                    onChange={handleChange}
                    inputRef={inputRef}
                >
                    {includeNone &&
                        <MenuItem value = "">
                            <em>None</em>
                        </MenuItem>
                    }

                    {options.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default DropdownSelector;