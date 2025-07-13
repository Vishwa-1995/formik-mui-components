import React from "react";
import { useField, useFormikContext } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextFieldProps } from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";

interface DatePickerWrapperProps {
  name: string;
  label: string;
  [key: string]: any;
}

const DatePickerWrapper: React.FC<DatePickerWrapperProps> = ({
  name,
  label,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (date: Dayjs | null) => {
    // Convert to ISO string or null before saving to Formik
    setFieldValue(name, date ? date.toISOString() : null);
  };

  // Convert Formik value back to Dayjs object for the DatePicker
  const value = field.value ? dayjs(field.value) : null;

  const configTextField: TextFieldProps = {
    ...otherProps,
    variant: "outlined",
    fullWidth: true,
    margin: "dense",
    error: meta.touched && !!meta.error,
    helperText: meta.touched && meta.error,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={handleChange}
        slotProps={{ textField: configTextField }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerWrapper;
