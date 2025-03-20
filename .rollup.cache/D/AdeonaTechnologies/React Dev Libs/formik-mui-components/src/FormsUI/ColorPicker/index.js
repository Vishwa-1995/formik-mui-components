import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import "./index.css";
import { SketchPicker } from "react-color";
import { useField, useFormikContext } from "formik";
import Typography from "@mui/material/Typography";
const ColorPicker = ({ name, label, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const [pickerState, setPickerState] = useState(false);
    const handleClick = () => {
        setPickerState(!pickerState);
    };
    const handleClose = () => {
        setPickerState(false);
    };
    const handleChange = (color) => {
        setFieldValue(name, `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
    };
    return (_jsxs("div", { className: "row", children: [_jsx("div", { className: "col-9", children: _jsx(Typography, { variant: "body2", color: "textSecondary", children: label }) }), _jsx("div", { className: "col", children: _jsx("div", { className: "swatch", onClick: handleClick, children: _jsx("div", { className: "color", style: {
                            background: field.value,
                        } }) }) }), meta && meta.error ? (_jsx(Typography, { variant: "caption", color: "error", children: meta.error })) : null, pickerState ? (_jsxs("div", { className: "popover", children: [_jsx("div", { className: "cover", onClick: handleClose }), _jsx(SketchPicker, { className: "sketch-picker", color: field.value, onChange: handleChange })] })) : null] }));
};
export default ColorPicker;
//# sourceMappingURL=index.js.map