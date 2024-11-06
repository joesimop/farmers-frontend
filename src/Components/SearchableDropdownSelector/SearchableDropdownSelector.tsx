import { Autocomplete, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { FieldControlModel } from '../../lib/Constants/DataModels';

export interface DropdownSelectorProps {
    options: string[],
    firstselected: string,
    onSelect?: Function
    fieldState: FieldControlModel
}
  
const SearchableDropdownSelector = (SelectorData:DropdownSelectorProps) => {
    const [selectedOption, setSelectedOption] = useState<string>('');

    const handleChange = (event: SelectChangeEvent, newValue:String | null)  => {
        setSelectedOption(newValue as string);
        if(SelectorData.onSelect !== undefined)
        {
            SelectorData.onSelect(newValue as string);
        }
    };

    useEffect(() => {
        setSelectedOption(SelectorData.firstselected);
    }   , [SelectorData.firstselected]);

    return (
        <div>
            <Autocomplete
                value={selectedOption}
                onChange={(event:any, newValue:string | null) => handleChange(event, newValue)}
                disableClearable={true}
                options={SelectorData.options}
                renderInput={(params) => <TextField {...params} label="Select Vendor..." variant="standard"/>}
                disabled={SelectorData.fieldState.fieldStatus === "disabled"}/>
        </div>
    );
};

export default SearchableDropdownSelector;