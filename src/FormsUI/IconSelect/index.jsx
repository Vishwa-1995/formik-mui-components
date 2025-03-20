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

  return (
    <TextField
      {...configSelect}
      inputProps={{ style: { fontSize: 13 } }}
      InputLabelProps={{ style: { fontSize: 13 } }}
      FormHelperTextProps={{ style: { fontSize: 11 } }}
    >
      {options.map((item, pos) => {
        return (
          <MenuItem key={pos} value={item.value}>
            <Typography variant="subtitle2">
              <i className={item.label}></i>&nbsp;&nbsp;{item.name}
            </Typography>
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default IconSelectWrapper;
