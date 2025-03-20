import React from "react";
import { useField, useFormikContext } from "formik";
import { TextField } from "@mui/material";

const SuffixTextareaWrapper = ({ name, suffix, maskType, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, mata] = useField(name);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(suffix)) {
      setFieldValue(name, value);
    } else if (!value.includes(suffix) && !field.value.includes(suffix)) {
      setFieldValue(name, value + suffix);
    }
  };

  const configTextarea = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    onChange: handleInputChange,
  };

  if (mata && mata.touched && mata.error) {
    configTextarea.error = true;
    configTextarea.helperText = mata.error;
  }

  return <TextField {...configTextarea} margin="dense" />;
};

export default SuffixTextareaWrapper;
