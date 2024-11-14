import { Autocomplete, TextField } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useFormControl } from '../Form Flow/useFormControl';
import { nextMSMFormField } from '../Form Flow/MSMFormStateFunctions';

export interface DropdownSelectorProps {
    options: string[],
    firstselected: string,
    onSelect?: Function,
    formKey: string
}
  
const SearchableDropdownSelector = (SelectorData:DropdownSelectorProps) => {
    const [selectedOption, setSelectedOption] = useState<string>('');

    //Setup form control
    const inputRef = useFormControl(SelectorData.formKey);

    const handleChange = (event: SelectChangeEvent, newValue:String | null)  => {
        setSelectedOption(newValue as string);
        if(SelectorData.onSelect !== undefined)
        {
            SelectorData.onSelect(newValue as string);
        }
        nextMSMFormField();
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
                renderInput={(params) => 
                <TextField {...params} 
                    label="Select Vendor..." 
                    variant="standard" 
                    inputRef={inputRef}/>}
                />
        </div>
    );
};

export default SearchableDropdownSelector;