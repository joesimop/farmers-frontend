import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DatePickerComponent from "../../Components/DatePicker/DatePicker";
import DropdownSelector from '../../Components/DropdownSelector/DropdownSelector';


const Checkout = () => {

  return (
    <div>
    <p>Checkout</p>
    <DropdownSelector 
      options={["one", "two", "three"]} 
      firstselected="on" 
      onSelect={() => {console.log("SELECTED THE GUY")}}/>

    <DatePickerComponent/>
    </div>
  );
};

export default Checkout;