import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DatePickerComponent from "../../Components/DatePicker/DatePicker";


const Checkout = () => {

  return (
    <div>
    <p>Checkout</p>
    <DatePickerComponent/>
    </div>
  );
};

export default Checkout;