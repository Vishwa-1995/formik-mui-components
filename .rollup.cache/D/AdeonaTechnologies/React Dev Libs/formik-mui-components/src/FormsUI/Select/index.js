import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useField, useFormikContext } from 'formik';
import { MenuItem, TextField } from '@mui/material';
const SelectWrapper = ({ name, options, customHandleChange, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const handleChange = evt => {
        const { value } = evt.target;
        setFieldValue(name, value);
    };
    const configSelect = {
        ...field,
        ...otherProps,
        variant: 'outlined',
        fullWidth: true,
        select: true,
        margin: "dense",
        onChange: customHandleChange || handleChange
    };
    if (meta && meta.touched && meta.error) {
        configSelect.error = true;
        configSelect.helperText = meta.error;
    }
    return (_jsx(TextField, { ...configSelect, children: options.length > 0 ? options.map((item, pos) => {
            return (_jsx(MenuItem, { value: item.value, children: item.label }, pos));
        }) :
            _jsx(MenuItem, { disabled: true, children: "No Data" }) }));
};
export default SelectWrapper;
//# sourceMappingURL=index.js.map