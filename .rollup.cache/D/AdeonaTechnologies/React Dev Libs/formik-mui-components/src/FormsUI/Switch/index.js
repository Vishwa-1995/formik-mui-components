import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { FormControl, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";
const SwitchWrapper = ({ name, label, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const handleChange = (evt) => {
        const { checked } = evt.target;
        setFieldValue(name, checked);
    };
    const configCheckbox = {
        ...field,
        ...otherProps,
        onChange: handleChange,
    };
    const configFormControl = {};
    if (meta && meta.touched && meta.error) {
        configFormControl.error = true;
    }
    return (_jsx(FormControl, { ...configFormControl, children: _jsx(FormGroup, { children: _jsx(FormControlLabel, { control: _jsx(Switch, { ...configCheckbox, checked: field.value }), label: _jsx(Typography, { variant: "body2", color: "textSecondary", children: label }) }) }) }));
};
export default SwitchWrapper;
//# sourceMappingURL=index.js.map