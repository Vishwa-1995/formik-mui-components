import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";

interface SwitchWrapperProps extends Omit<SwitchProps, "name"> {
  name: string;
  label: string;
}

const SwitchWrapper: React.FC<SwitchWrapperProps> = ({
  name,
  label,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target;
    setFieldValue(name, checked);
  };

  const configCheckbox: SwitchProps = {
    ...field,
    ...otherProps,
    onChange: handleChange,
    checked: field.value,
  };

  const showError = meta && meta.touched && Boolean(meta.error);

  return (
    <FormControl error={showError}>
      <FormGroup>
        <FormControlLabel
          control={<Switch {...configCheckbox} />}
          label={
            <Typography variant="body2" color="textSecondary">
              {label}
            </Typography>
          }
        />
      </FormGroup>
      {showError && (
        <FormHelperText sx={{ color: "error.main" }}>
          {meta.error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SwitchWrapper;
