import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useField, useFormikContext } from "formik";
import {FormHelperText} from "@mui/material";

const RadioGroupWrapper = ({ name, label, disabled, radioGroup, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt) => {
    setFieldValue(name, evt.target.value);
  };

  const configRadioGroup = {
    ...field,
    ...otherProps,
    onChange: handleChange,
  };

    const configFormControl = {};
    if (meta && meta.touched && meta.error) {
        configFormControl.error = true;
        configFormControl.children = meta.error;
    }

    return (
        <FormControl disabled={disabled}>
            <FormLabel>{label}</FormLabel>
            <RadioGroup row {...configRadioGroup}>
                {radioGroup.map((radio, index) => (
                    <FormControlLabel
                        key={index}
                        value={radio.value}
                        control={<Radio sx={{
                            color: radio.color,
                            '&.Mui-checked': {
                                color: radio.color,
                            },
                        }}/>}
                        label={radio.label}
                        sx={{
                            color: radio.labelColor,
                        }}
                    />
                ))}
            </RadioGroup>
            <FormHelperText {...configFormControl}></FormHelperText>
        </FormControl>
    );
};

export default RadioGroupWrapper;
