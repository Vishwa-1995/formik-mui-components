import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useField, useFormikContext } from "formik";
import { FormHelperText } from "@mui/material";

interface RadioOption {
  value: string | number;
  label: string;
  color?: string;
  labelColor?: string;
}

interface RadioGroupWrapperProps {
  name: string;
  label: string;
  disabled?: boolean;
  radioGroup: RadioOption[];
  [key: string]: any; // For additional props like `className`, `row`, etc.
}

const RadioGroupWrapper: React.FC<RadioGroupWrapperProps> = ({
  name,
  label,
  disabled,
  radioGroup,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, evt.target.value);
  };

  const configRadioGroup = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

  const showError = meta && meta.touched && Boolean(meta.error);

  return (
    <FormControl disabled={disabled} error={showError}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row {...configRadioGroup}>
        {radioGroup.map((radio, index) => (
          <FormControlLabel
            key={index}
            value={radio.value}
            control={
              <Radio
                sx={{
                  color: radio.color,
                  "&.Mui-checked": {
                    color: radio.color,
                  },
                }}
              />
            }
            label={radio.label}
            sx={{
              color: radio.labelColor,
            }}
          />
        ))}
      </RadioGroup>
      {showError && (
        <FormHelperText sx={{ color: "error.main" }}>
          {meta.error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default RadioGroupWrapper;
