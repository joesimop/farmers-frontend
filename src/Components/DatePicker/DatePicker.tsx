import * as React from 'react';
import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FieldControlModel } from '../../lib/Constants/DataModels';
import "../../index.css"


interface DatePickerProps {
  initalDate: Dayjs;
  fieldState: FieldControlModel;
  onDateChanged: (value: Dayjs | null) => void;
}

const  DatePickerComponent: React.FC<DatePickerProps>  = ({initalDate, fieldState, onDateChanged}) => {
  const [Date, setDate] = React.useState<Dayjs | null>();

  const handleDateChange = (date: Dayjs | null) => {
    setDate(date);
    onDateChanged(date as Dayjs);
  }

  return (
    <div className='default-padding' style={{}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker', 'DatePicker']}>
          <DatePicker
            label={fieldState.input_label}
            value={Date}
            onChange={(newValue) => handleDateChange(newValue)}
            disabled={fieldState.fieldStatus === "disabled"}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
    );
  }

  export default DatePickerComponent;