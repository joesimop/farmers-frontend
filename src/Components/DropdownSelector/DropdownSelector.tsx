import React, { useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { FieldControlModel } from '../../lib/Constants/DataModels';

interface DropdownSelectorProps {
    options: string[];
    firstValue: string;
    onChanged: (value: string) => void;
    fieldState: FieldControlModel;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({ options, firstValue, onChanged, fieldState }) => {
    const [selectedValue, setSelectedValue] = React.useState(firstValue);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedValue(value);
        onChanged(value);
        console.log("received value: ", value);
    };

    useEffect(() => {     
        setSelectedValue(firstValue);
    }, [firstValue]);

    return (
        <div className="default-padding">
            <FormControl fullWidth disabled={fieldState.fieldStatus === "disabled"} error={fieldState.fieldStatus === "error"}>
                <InputLabel id="dropdown-selector-label">{fieldState.input_label}</InputLabel>
                <Select
                    sx={{ textAlign: "left" }}
                    variant="standard"
                    labelId="dropdown-selector-label"
                    value={selectedValue}
                    onChange={handleChange}
                >
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