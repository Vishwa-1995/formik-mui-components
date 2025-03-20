import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useField, useFormikContext } from "formik";
import { MenuItem, TextField, Typography } from "@mui/material";
const IconSelectWrapper = ({ name, options, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const handleChange = (evt) => {
        const { value } = evt.target;
        setFieldValue(name, value);
    };
    const configSelect = {
        ...field,
        ...otherProps,
        variant: "outlined",
        fullWidth: true,
        select: true,
        onChange: handleChange,
    };
    if (meta && meta.touched && meta.error) {
        configSelect.error = true;
        configSelect.helperText = meta.error;
    }
    return (_jsx(TextField, { ...configSelect, inputProps: { style: { fontSize: 13 } }, InputLabelProps: { style: { fontSize: 13 } }, FormHelperTextProps: { style: { fontSize: 11 } }, children: options.map((item, pos) => {
            return (_jsx(MenuItem, { value: item.value, children: _jsxs(Typography, { variant: "subtitle2", children: [_jsx("i", { className: item.label }), "\u00A0\u00A0", item.name] }) }, pos));
        }) }));
};
export default IconSelectWrapper;
//# sourceMappingURL=index.js.map