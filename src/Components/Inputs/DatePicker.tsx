import React, { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormControl } from '../Form Flow/useFormControl';
import { nextMSMFormField } from '../Form Flow/MSMFormStateFunctions';

import "../../index.css"

interface DatePickerProps{
  initalDate: Dayjs;
  formKey: string;
  onDateChanged: (value: Dayjs | null) => void;
}

const  DatePickerComponent: React.FC<DatePickerProps> = ({initalDate, formKey, onDateChanged}) => {
 
  // Initialize the selected value
  const [Date, setDate] = React.useState<Dayjs | null>();

  // Setup form control
  const inputRef = useFormControl(formKey);

  const handleDateChange = (date: Dayjs | null) => {
    console.log(date);
    setDate(date);
    onDateChanged(date as Dayjs);
  }


  return (
    <div className='form-margin' style={{}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker', 'DatePicker']}>
          <DatePicker
            label={formKey}
            value={Date}
            onChange={(newValue) => handleDateChange(newValue)}
            onClose={() => nextMSMFormField()}
            inputRef={inputRef}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
    );
  }

  export default DatePickerComponent;