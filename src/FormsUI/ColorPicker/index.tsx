import React, { useState } from "react";
import reactCSS from "reactcss";
import { SketchPicker, ColorResult } from "react-color";
import { useField, useFormikContext } from "formik";
import Typography from "@mui/material/Typography";
import { Box, Grid2 } from "@mui/material";

interface ColorPickerWrapperProps {
  name: string;
  label: string;
  [key: string]: any;
}

const ColorPickerWrapper: React.FC<ColorPickerWrapperProps> = ({
  name,
  label,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const [pickerState, setPickerState] = useState(false);

  const handleClick = () => {
    setPickerState(!pickerState);
  };

  const handleClose = () => {
    setPickerState(false);
  };

  const handleChange = (color: ColorResult) => {
    setFieldValue(
      name,
      `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
    );
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: field.value,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute" as const,
        zIndex: "2",
        background: "none",
        border: "none",
      },
      cover: {
        position: "fixed" as const,
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
      sketchPicker: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  });

  return (
    <Grid2 container spacing={1} direction="column">
      <Typography variant="body2">{label}</Typography>
      <Grid2>
        <Box style={styles.swatch} onClick={handleClick}>
          <Box style={styles.color} />
        </Box>
        {pickerState ? (
          <Box style={styles.popover}>
            <Box style={styles.cover} onClick={handleClose} />
            <SketchPicker color={field.value} onChange={handleChange} />
          </Box>
        ) : null}
      </Grid2>
      {meta.touched && meta.error && (
        <Typography variant="caption" color="error">
          {meta.error}
        </Typography>
      )}
    </Grid2>
  );
};

export default ColorPickerWrapper;
