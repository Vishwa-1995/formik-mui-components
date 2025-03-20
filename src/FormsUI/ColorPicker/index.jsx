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
    setFieldValue(
      name,
      `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
    );
  };

  return (
    <div className="row">
      <div className="col-9">
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
      </div>
      <div className="col">
        <div className="swatch" onClick={handleClick}>
          <div
            className="color"
            style={{
              background: field.value,
            }}
          />
        </div>
      </div>
      {meta && meta.error ? (
        <Typography variant="caption" color="error">
          {meta.error}
        </Typography>
      ) : null}
      {pickerState ? (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker
            className="sketch-picker"
            color={field.value}
            onChange={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;
