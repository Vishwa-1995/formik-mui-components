import { jsx as _jsx } from "react/jsx-runtime";
import { useField } from "formik";
import { TextField } from "@mui/material";
const TextFieldWrapper = ({ name, ...otherProps }) => {
    const [field, mata] = useField(name);
    const configTextfield = {
        ...field,
        ...otherProps,
        fullWidth: true,
        variant: "outlined",
    };
    if (mata && mata.touched && mata.error) {
        configTextfield.error = true;
        configTextfield.helperText = mata.error;
    }
    return (_jsx(TextField, { ...configTextfield, margin: "dense" }));
};
export default TextFieldWrapper;
//# sourceMappingURL=index.js.map