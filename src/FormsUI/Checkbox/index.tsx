import React from "react";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useField, useFormikContext } from "formik";
import Box from "@mui/material/Box";
import { FormHelperText, Typography } from "@mui/material";

import { SxProps, Theme } from "@mui/material/styles";

interface CheckboxWrapperProps {
  name: string;
  legend?: React.ReactNode;
  label: React.ReactNode;
  labelStyle?: SxProps<Theme>;
  customHandleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

const CheckboxWrapper: React.FC<CheckboxWrapperProps> = ({
  name,
  legend,
  label,
  labelStyle,
  customHandleChange = () => {},
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target;
    setFieldValue(name, checked);
    customHandleChange(evt);
  };

  const configCheckbox = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  const configFormControl: { error?: boolean; children?: React.ReactNode } = {};
  if (meta.touched && meta.error) {
    configFormControl.error = true;
    configFormControl.children = meta.error;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <FormControl component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={<Checkbox {...configCheckbox} checked={field.value} />}
            label={<Typography sx={labelStyle}>{label}</Typography>}
          />
        </FormGroup>
        <FormHelperText {...configFormControl}></FormHelperText>
      </FormControl>
    </Box>
  );
};

export default CheckboxWrapper;
