import { useEffect, useState } from "react";
import { FieldControlModel } from "../../lib/Constants/DataModels";
import TextField from "@mui/material/TextField";
import { MarketTokensModel } from "../../lib/Constants/DataModels";
import FlexGrid from "../../FlexGrid/FlexGrid";
import "../../index.css";

interface CheckoutNumericalEntryProps {
  fields: MarketTokensModel[];
  fieldState: FieldControlModel;
  onChange: (newValue: number, fieldIndex: number) => void;
}

const CheckoutNumericalEntry: React.FC<CheckoutNumericalEntryProps> = ({ fields, fieldState, onChange }) => {
  
    const [quantities, setQuantities] = useState<number[]>(fields.map(() => 0));
    const [tokenFields, setTokenFields] = useState<MarketTokensModel[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, fieldIndex: number) => {
        const newValue = parseFloat(event.target.value);

        onChange(isNaN(newValue) ? 0 : newValue, fieldIndex);

        quantities[fieldIndex] = newValue;
        setQuantities([...quantities]);
    };

    useEffect(() => {

        setTokenFields(fields);
        // console.log("fields: ", fields);

    }, [fields]);

    useEffect(() => {

        if (fields.length !== quantities.length) {
            setQuantities(fields.map(() => 0));
        }

        setTokenFields(fields);
        // console.log("fields: ", fields);
        
    }, [fields, quantities]);

    const TokenFieldItems = tokenFields.map((field: MarketTokensModel, index: number) => (
      <TextField
        key={field.type}
        type="number"
        value={quantities[index]}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, index)}
        label={field.type}
        disabled={fieldState.fieldStatus === "disabled"}
        variant="standard"
        fullWidth // Optional: makes the TextField take up the full width of its container
      />
    ));

  return (
    <div className="form-margin" style= {{}}>
      <FlexGrid items={TokenFieldItems} />
    </div>
  );
};

export default CheckoutNumericalEntry;
