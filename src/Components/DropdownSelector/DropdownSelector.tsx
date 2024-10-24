import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface DropdownSelectorProps {
    options: string[],
    firstselected: string,
    onSelect?: Function
}
  
const  DropdownSelector = (SelectorData:DropdownSelectorProps) => {
    const [selectedOption, setSelectedOption] = useState<string>('');

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedOption(event.target.value);
        if(SelectorData.onSelect !== undefined)
        {
            SelectorData.onSelect();
        }
    };

    useEffect(() => {
        setSelectedOption(SelectorData.firstselected);
    }   , []);

    
    const options:string[] = SelectorData.options;

    return (
        <div>
            <Box sx={{ minWidth: 130 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                label="Age"
                onChange={handleChange}
                >
                {options.map((element) => {
                    return <MenuItem value={element}>{element}</MenuItem>
                })}
                </Select>
            </FormControl>
            </Box>
        </div>
    );
};

export default DropdownSelector;