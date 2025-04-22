import React from "react";
import { useField } from "formik";
import { TextField, TextFieldProps } from "@mui/material";

type TextFieldWrapperProps = TextFieldProps & {
  name: string;
};

const TextFieldWrapper: React.FC<TextFieldWrapperProps> = ({
  name,
  ...otherProps
}) => {
  const [field, meta] = useField(name);

  const configTextfield: TextFieldProps = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    margin: "dense",
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return <TextField {...configTextfield} />;
};

export default TextFieldWrapper;
