import React from "react";
import { useField, useFormikContext } from "formik";
import {
  LocalizationProvider,
  // MobileTimePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TimePickerWrapper = ({ name, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    setFieldValue(name, evt);
  };

  const configTimePicker = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  const configTextField = {
    variant: "outlined",
    fullWidth: true,
    margin: "dense",
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        {...configTimePicker}
        ampmInClock={true}
        views={["hours", "minutes", "seconds"]}
        slotProps={{ textField: { ...configTextField } }}
      />
    </LocalizationProvider>
  );
};

export default TimePickerWrapper;
