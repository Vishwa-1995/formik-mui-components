import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import Button from "@mui/material/Button";
import { useFormikContext } from "formik";
const ButtonWrapper = ({ children, ...otherProps }) => {
    const { submitForm } = useFormikContext();
    const handleSubmit = () => {
        submitForm();
    };
    const configButton = {
        color: "primary",
        ...otherProps,
        onClick: handleSubmit,
    };
    return _jsx(Button, { ...configButton, children: children });
};
export default ButtonWrapper;
//# sourceMappingURL=index.js.map