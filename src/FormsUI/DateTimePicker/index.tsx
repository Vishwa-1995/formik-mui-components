import { useField, useFormikContext } from "formik";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextFieldProps } from "@mui/material/TextField";
import { Dayjs } from "dayjs";

interface DateTimePickerWrapperProps {
  required?: boolean;
  name: string;
  [key: string]: any;
}

const DateTimePickerWrapper: React.FC<DateTimePickerWrapperProps> = ({
  required,
  name,
  ...otherProps
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (date: Dayjs | null) => {
    setFieldValue(name, date);
  };

  const configTimePicker = {
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
