import React from "react";
import { useField, useFormikContext } from "formik";
import { MenuItem, TextField, TextFieldProps, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface Option {
  value: string | number;
  icon: SvgIconComponent; // This is used as the icon class
  name: string; // This is the visible text
}

type IconSelectWrapperProps = TextFieldProps & {
  name: string;
  options: Option[];
};

const IconSelectWrapper: React.FC<IconSelectWrapperProps> = ({
  name,
  options,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSelect: TextFieldProps = {
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
    <TextField {...configSelect}>
      {options.map((item, pos) => {
        const IconComponent = item.icon;
        return (
          <MenuItem key={pos} value={item.value}>
            <Typography variant="subtitle2" display="flex" alignItems="center">
              <IconComponent fontSize="small" style={{ marginRight: 8 }} />
              {item.name}
            </Typography>
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default IconSelectWrapper;
