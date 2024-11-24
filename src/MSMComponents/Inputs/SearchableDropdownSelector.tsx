import { Autocomplete, TextField } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useFormControl } from '../Form Flow/useFormControl';
import { nextMSMFormField, setFieldValidationState } from '../Form Flow/MSMFormStateFunctions';

export interface DropdownSelectorProps {
    options: string[],
    firstselected: string,
    onSelect?: Function,
    formKey: string
}
  
const SearchableDropdownSelector = (SelectorProps: DropdownSelectorProps) => {

    const [selectedOption, setSelectedOption] = useState<string>('');

    //Setup form control
    const inputRef = useFormControl(SelectorProps.formKey);

    const handleChange = (event: SelectChangeEvent, newValue:String | null)  => {
        setSelectedOption(newValue as string);
        if(SelectorProps.onSelect !== undefined)
        {
            SelectorProps.onSelect(newValue as string);
        }
        setFieldValidationState(SelectorProps.formKey, true)
        nextMSMFormField();
    };

    // Automatically set value to first choice when options changes.
    // Need the last conditional to ensure we are not incurring sets
    // when setSelectedValue is called.
    useEffect(() => {
        if (SelectorProps.options && 
            SelectorProps.options.length > 0 && 
            !SelectorProps.options.includes(selectedOption)) {

            setSelectedOption(SelectorProps.options[0]);
            setFieldValidationState(SelectorProps.formKey, true)
        }
    }, [SelectorProps.options]);


    return (
        <div>
            <Autocomplete
                value={selectedOption}
                onChange={(event:any, newValue:string | null) => handleChange(event, newValue)}
                disableClearable={true}
                options={SelectorProps.options}
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