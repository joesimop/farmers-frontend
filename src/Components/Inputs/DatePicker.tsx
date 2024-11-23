import React, { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormControl } from '../Form Flow/useFormControl';
import { nextMSMFormField, setFieldValidationState } from '../Form Flow/MSMFormStateFunctions';
import { isFieldValid, ErrorState } from '../../lib/Constants/Types';
import {ButtonProps as MUIButtonProps} from '@mui/material/Button';

type DatePickerType = Dayjs | null | undefined;

interface DatePickerProps {
  defaultDate: Dayjs;
  formKey: string;
  onDateChanged: (value: Dayjs | null) => void;
  validationFunction?: (value: DatePickerType) => string | null;
  validateInput?: boolean;
  sx?: MUIButtonProps['sx'];
}

const MSMDatePicker: React.FC<DatePickerProps> = ({
  defaultDate,
  formKey,
  onDateChanged,
  validationFunction,
  validateInput = false,
  sx = []
}) => {
  const [Date, setDate] = useState<DatePickerType>(undefined);
  const [error, setError] = useState<ErrorState>(null);
  const [isFieldValidResult, setIsFieldValid] = useState<boolean | null>(false);
  const inputRef = useFormControl(formKey);


  const isDateUntouched = (date: DatePickerType): date is undefined  => { return date === undefined }

  // Default validation function
  const defaultValidation = (value: DatePickerType): ErrorState => {
    if (
      value &&
      value.isValid() && 
      value.year() !== 0 && 
      value.month() >= 0 && 
      value.date() > 0 
    ) {
      return null; // All fields are valid
    }
    return "Date must have a valid year, month, and day.";
  };

  // Validate the date using either the default or custom validation function
  const validateDate = (date: DatePickerType): ErrorState => {

    if (validationFunction) return validationFunction(date);

    return defaultValidation(date);
  };

  // Set the error state and field validation state
  const validateField = (date: DatePickerType): boolean | null => {
    console.log("validatingsaksld;fj")
    if (validateInput || validationFunction) {
      const currentError = validateDate(date); 
      const isFieldValidResult = isFieldValid(currentError);
      setError(currentError);
      setFieldValidationState(formKey, isFieldValidResult);
      return isFieldValidResult;
    }
    return null; 
  };

  const onTextEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(e.key == 'Enter'){
        validateField(Date)
        nextMSMFormField();
    }
  }

  // Handle changes in the date value
  const handleDateChange = (newDate: DatePickerType) => {
    setDate(newDate);
    onDateChanged(newDate as Dayjs);
  };

  // Automatically validate whenever the `Date` state changes
  useEffect(() => {
    if (!isDateUntouched(Date)) {
      setIsFieldValid( validateField(Date) );
    }
  }, [Date]);

  useEffect(() => {
    if(isFieldValidResult){
      nextMSMFormField()
    }
  }, [isFieldValidResult])

  return (
    <div className="form-margin">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <DemoContainer components={['DatePicker', 'DatePicker']}> */}
          <DatePicker
            label={formKey}
            value={Date}
            onChange={handleDateChange}
            inputRef={inputRef}
            slotProps={{
              textField: {
                error: !isFieldValid(error),
                helperText: error,
                onKeyDown: onTextEnter
              },
            }}
            sx={{...sx}}
          />
        {/* </DemoContainer> */}
      </LocalizationProvider>
    </div>
  );
};

export default MSMDatePicker;
