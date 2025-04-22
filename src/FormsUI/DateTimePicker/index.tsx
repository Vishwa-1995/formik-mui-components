import { useField, useFormikContext } from "formik";
import {
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextFieldProps } from "@mui/material/TextField";
import { Dayjs } from "dayjs";

interface DateTimePickerWrapperProps {
  name: string;
  [key: string]: any;
}

const DateTimePickerWrapper: React.FC<DateTimePickerWrapperProps> = ({ name, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (date: Dayjs | null) => {
    setFieldValue(name, date);
  };

  const configTimePicker = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  const configTextField: Partial<TextFieldProps> = {
    variant: "outlined",
    fullWidth: true,
    margin: "dense",
  };

  if (meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        orientation="landscape"
        {...configTimePicker}
        ampmInClock
        views={["year", "day", "hours", "minutes", "seconds"]}
        slotProps={{ textField: configTextField }}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerWrapper;