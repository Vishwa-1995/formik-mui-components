import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useField, useFormikContext } from "formik";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FormHelperText } from "@mui/material";
const CheckboxWrapper = ({ name, legend, customHandleChange = () => { }, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const handleChange = (evt) => {
        const { checked } = evt.target;
        setFieldValue(name, checked);
        customHandleChange(evt);
    };
    const configCheckbox = {
        ...field,
        ...otherProps,
        onChange: handleChange,
    };
    const configFormControl = {};
    if (meta.touched && meta.error) {
        configFormControl.error = true;
        configFormControl.children = meta.error;
    }
    return (_jsxs(FormControl, { children: [_jsx(FormGroup, { children: _jsxs(Stack, { direction: "row", children: [_jsx(FormControlLabel, { control: _jsx(Checkbox, { ...configCheckbox, checked: field.value }), label: "" }), _jsx(Box, { mt: 1.5, children: legend })] }) }), _jsx(FormHelperText, { ...configFormControl })] }));
};
export default CheckboxWrapper;
//# sourceMappingURL=index.js.map