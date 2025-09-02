import { useField, useFormikContext } from "formik";
import {
  DateTimePicker,
  DesktopDateTimePicker,
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextFieldProps } from "@mui/material/TextField";
import { Dayjs } from "dayjs";

interface DateTimePickerWrapperProps {
  required?: boolean;
  version?: "desktop" | "mobile" | "responsive";
  name: string;
  [key: string]: any;
}

const DateTimePickerWrapper: React.FC<DateTimePickerWrapperProps> = ({
  required,
  version = "responsive",
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
      {version === "desktop" && (
        <DesktopDateTimePicker
          {...configTimePicker}
          ampmInClock
          views={["year", "day", "hours", "minutes", "seconds"]}
          slotProps={{ textField: configTextField }}
        />
      )}
      {version === "mobile" && (
        <MobileDateTimePicker
          {...configTimePicker}
          ampmInClock
          views={["year", "day", "hours", "minutes", "seconds"]}
          slotProps={{ textField: configTextField }}
        />
      )}
      {version === "responsive" && (
        <DateTimePicker
          {...configTimePicker}
          ampmInClock
          views={["year", "day", "hours", "minutes", "seconds"]}
          slotProps={{ textField: configTextField }}
        />
      )}
    </LocalizationProvider>
  );
};

export default DateTimePickerWrapper;
