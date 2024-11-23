import { useState } from "react";
import { useFormControl } from "../Form Flow/useFormControl";
import { nextMSMFormField } from "../Form Flow/MSMFormStateFunctions";
import NumberInput from "./NumberInput";


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

    const handleChange = (value: number) => {
        onChange(isNaN(value) ? 0 : value * perDollarValue, listIndex);
        setQuantity(value);
    };

  return (
      <NumberInput
        key={type}
        onChange={(newValue) => handleChange(newValue)}
        label={type}
        formKey={formKey}
        useValidation
      />
  );
};

export default TokenInput;
