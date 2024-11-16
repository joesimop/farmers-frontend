import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useFormControl } from "../Form Flow/useFormControl";
import { nextMSMFormField } from "../Form Flow/MSMFormStateFunctions";


interface NumberInputProps {
  label: string;
  formKey: string;
  defaultValue?: number;
  onEnter: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, formKey, defaultValue = 0, onEnter}) => {
  
    const [value, setValue] = useState<number>(defaultValue);

    const inputRef = useFormControl(formKey);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const newValue = parseFloat(event.target.value);
        setValue(newValue)

    };

    const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key == 'Enter'){
            onEnter(value);
            nextMSMFormField();
        }
    }

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
        fullWidth // Optional: makes the TextField take up the full width of its container
      />
    </div>
  );
};

export default NumberInput;
