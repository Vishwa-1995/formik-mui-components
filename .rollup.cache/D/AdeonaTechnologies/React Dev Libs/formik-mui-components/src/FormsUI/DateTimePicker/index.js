import { jsx as _jsx } from "react/jsx-runtime";
import { useField, useFormikContext } from "formik";
import { DateTimePicker, LocalizationProvider,
// MobileDateTimePicker,
// StaticDateTimePicker,
 } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const DateTimePickerWrapper = ({ name, ...otherProps }) => {
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
    if (meta && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (_jsx(LocalizationProvider, { dateAdapter: AdapterDayjs, children: _jsx(DateTimePicker, { orientation: "landscape", ...configTimePicker, ampmInClock: true, views: ["year", "day", "hours", "minutes", "seconds"], slotProps: { textField: { ...configTextField } } }) }));
};
export default DateTimePickerWrapper;
//# sourceMappingURL=index.js.map