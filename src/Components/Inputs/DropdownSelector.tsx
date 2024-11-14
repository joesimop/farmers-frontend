import React, { useContext } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { FieldControlModel } from '../../lib/Constants/DataModels';
import { useFormControl } from '../Form Flow/useFormControl';
import { nextMSMFormField } from '../Form Flow/MSMFormStateFunctions';

interface DropdownSelectorProps {
    options: string[];
    defaultValue: string;
    formKey: string;
    onChanged: (value: string) => void;
    includeNone?: boolean;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({ options, formKey, defaultValue, includeNone = false, onChanged }) => {
   
    // Initialize the selected value
    const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue);

    //Get the section this form is in and subscribe to the Zustand store
    const inputRef = useFormControl(formKey);

    
    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedValue(value);
        onChanged(value);
        nextMSMFormField();
    };

    return (
        <div className="form-margin">
            <FormControl style={{minWidth: 120}} >
                <InputLabel id="dropdown-selector-label">{formKey}</InputLabel>
                <Select
                    sx={{ textAlign: "left" }}
                    variant="standard"
                    labelId="dropdown-selector-label"
                    value={selectedValue}
                    onChange={handleChange}
                    inputRef={inputRef}
                    fullWidth
                >
                    {includeNone &&
                    <MenuItem value = "">
                        <em>None</em>
                    </MenuItem>}

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