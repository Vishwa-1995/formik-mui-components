import React from "react";
import { useField, useFormikContext } from "formik";
import {
  LocalizationProvider,
  TimePicker,
  TimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextFieldProps } from "@mui/material";
import { Dayjs } from "dayjs";

interface TimePickerWrapperProps
  extends Omit<TimePickerProps<Dayjs>, "value" | "onChange"> {
  name: string;
}

const TimePickerWrapper: React.FC<TimePickerWrapperProps> = ({
  name,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const handleChange = (value: Dayjs | null) => {
    setFieldValue(name, value);
  };

  const configTimePicker: TimePickerProps<Dayjs> = {
    ...otherProps,
    value: field.value,
    onChange: handleChange,
    ampmInClock: true,
    views: ["hours", "minutes", "seconds"],
    slotProps: {
      textField: {
        variant: "outlined",
        fullWidth: true,
        margin: "dense",
        error: !!(meta.touched && meta.error),
        helperText: meta.touched && meta.error ? meta.error : "",
      } as TextFieldProps,
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker {...configTimePicker} />
    </LocalizationProvider>
  );
};

export default TimePickerWrapper;
