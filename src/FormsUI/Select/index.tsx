import React from "react";
import { useField, useFormikContext } from "formik";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";

interface Option {
  value: string | number;
  label: string;
}

type SelectWrapperProps = TextFieldProps & {
  name: string;
  options: Option[];
  customHandleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  name,
  options,
  customHandleChange,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFieldValue(name, value);
  };

  const configSelect: TextFieldProps = {
    ...field,
    ...otherProps,
    variant: "outlined",
    fullWidth: true,
    select: true,
    margin: "dense",
    onChange: customHandleChange || handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {options.length > 0 ? (
        options.map((item, pos) => (
          <MenuItem key={pos} value={item.value}>
            {item.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No Data</MenuItem>
      )}
    </TextField>
  );
};

export default SelectWrapper;
