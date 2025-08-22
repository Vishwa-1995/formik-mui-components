import React from "react";
import { useField, useFormikContext } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextFieldProps } from "@mui/material/TextField";
import { Dayjs } from "dayjs";

interface DatePickerWrapperProps {
  required?: boolean;
  name: string;
  [key: string]: any;
}

const DatePickerWrapper: React.FC<DatePickerWrapperProps> = ({
  required,
  name,
  ...otherProps
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (date: Dayjs | null) => {
    setFieldValue(name, date);
  };

  const configDateTimePicker = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFieldTouched(name, true);
  };

  const configTextField: Partial<TextFieldProps> = {
    required: required,
    variant: "outlined",
    fullWidth: true,
    margin: "dense",
    onBlur: handleBlur,
  };

  if (meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="date picker template"
        {...configDateTimePicker}
        slotProps={{ textField: configTextField }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerWrapper;
