import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useFormControl } from '../Form Flow/useFormControl';
import { nextMSMFormField, setFieldValidationState } from '../Form Flow/MSMFormStateFunctions';


interface EnumDropdownSelectorProps<T extends Record<string, string>> {
    enumObject: T; 
    formKey: string;
    defaultValue: keyof T | T[keyof T]; 
    onChanged: (value: T[keyof T]) => void;
    includeNone?: boolean;
}

const EnumDropdownSelector = <T extends Record<string, string>>({
    enumObject,
    formKey,
    defaultValue,
    includeNone = false,
    onChanged,
}: EnumDropdownSelectorProps<T>) => {

    const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue.toString());

    const inputRef = useFormControl(formKey);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSelectedValue(value);
        onChanged(enumObject[value as keyof T] as T[keyof T]);
        nextMSMFormField();
        setFieldValidationState(formKey, true)  //Must be valid if changed
    };


    return (
        <div className="form-margin">
            <FormControl style={{ minWidth: 120 }}>
                <InputLabel id="enum-dropdown-selector-label">{formKey}</InputLabel>
                <Select
                    sx={{ textAlign: 'left' }}
                    variant="standard"
                    labelId="enum-dropdown-selector-label"
                    value={selectedValue}
                    onChange={handleChange}
                    fullWidth
                    inputRef={inputRef}
                >
                    {includeNone && (
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                    )}
                    {Object.keys(enumObject).map((key, index) => (
                        <MenuItem key={index} value={key}>
                            {key}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default EnumDropdownSelector;
