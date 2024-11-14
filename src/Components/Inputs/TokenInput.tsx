import { useState } from "react";
import TextField from "@mui/material/TextField";
import { useFormControl } from "../Form Flow/useFormControl";
import { nextMSMFormField } from "../Form Flow/MSMFormStateFunctions";


interface TokenInputProps {
  name: string;
  type: string;
  perDollarValue: number;
  listIndex: number;
  formKey: string;
  onChange(input: number, index: number): void;
}

const TokenInput: React.FC<TokenInputProps> = ({ name, type, perDollarValue, listIndex, formKey, onChange }) => {
  
    const [quantity, setQuantity] = useState<number>(0);

    const inputRef = useFormControl(formKey);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {

        const newQuantity = parseFloat(event.target.value);

        onChange(isNaN(newQuantity) ? 0 : newQuantity * perDollarValue, index);
        setQuantity(newQuantity);
    };

    const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.key == 'Enter'){
            nextMSMFormField();
        }
    }


  return (
    <div className="form-margin" style= {{}}>
      <TextField
        key={type}
        type="number"
        value={quantity}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, listIndex)}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => keyPress(event)}
        label={type}
        variant="standard"
        inputRef={inputRef}
        fullWidth // Optional: makes the TextField take up the full width of its container
      />
    </div>
  );
};

export default TokenInput;
