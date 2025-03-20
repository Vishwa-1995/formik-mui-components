import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useField, useFormikContext } from "formik";
import { FormHelperText } from "@mui/material";
const RadioGroupWrapper = ({ name, label, disabled, radioGroup, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const handleChange = (evt) => {
        setFieldValue(name, evt.target.value);
    };
    const configRadioGroup = {
        ...field,
        ...otherProps,
        onChange: handleChange,
    };
    const configFormControl = {};
    if (meta && meta.touched && meta.error) {
        configFormControl.error = true;
        configFormControl.children = meta.error;
    }
    return (_jsxs(FormControl, { disabled: disabled, children: [_jsx(FormLabel, { children: label }), _jsx(RadioGroup, { row: true, ...configRadioGroup, children: radioGroup.map((radio, index) => (_jsx(FormControlLabel, { value: radio.value, control: _jsx(Radio, { sx: {
                            color: radio.color,
                            '&.Mui-checked': {
                                color: radio.color,
                            },
                        } }), label: radio.label, sx: {
                        color: radio.labelColor,
                    } }, index))) }), _jsx(FormHelperText, { ...configFormControl })] }));
};
export default RadioGroupWrapper;
//# sourceMappingURL=index.js.map