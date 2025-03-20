import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { useField, useFormikContext } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const DatePickerWrapper = ({ name, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const handleChange = (evt) => {
        setFieldValue(name, evt);
    };
    const configDateTimePicker = {
        ...field,
        ...otherProps,
        onChange: handleChange,
    };
    const configTextField = {
        variant: "outlined",
        fullWidth: true,
        margin: "dense"
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (_jsx(LocalizationProvider, { dateAdapter: AdapterDayjs, children: _jsx(DatePicker, { label: "date picker template", ...configDateTimePicker, slotProps: { textField: { ...configTextField } } }) }));
};
export default DatePickerWrapper;
//# sourceMappingURL=index.js.map