import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useFormControl } from "../Form Flow/useFormControl";
import { nextMSMFormField } from "../Form Flow/MSMFormStateFunctions";


interface TextInputProps {
  label: string;
  formKey: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ 
    label, 
    formKey, 
    defaultValue = "", 
    onChange = () => undefined,
    onEnter = () => undefined}) => {
  
    const [value, setValue] = useState<string>(defaultValue);

    const inputRef = useFormControl(formKey);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = event.target.value;
        setValue(newValue)

        if(onChange != undefined){
            onChange(newValue)
        }

    };

    const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key == 'Enter' || e.key == 'Tab'){
            if(onEnter != undefined){
                onEnter(value);
            }
            nextMSMFormField();
        }
    }


  return (
    <div className="form-margin" style= {{}}>
      <TextField
        key={label}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => keyPress(event)}
        onBlur={() => onEnter(value)}
        label={label}
        variant="standard"
        inputRef={inputRef}
        fullWidth // Optional: makes the TextField take up the full width of its container
      />
    </div>
  );
};

export default TextInput;
