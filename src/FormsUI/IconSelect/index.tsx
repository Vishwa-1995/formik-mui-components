import React from "react";
import { useField, useFormikContext } from "formik";
import { Box, CircularProgress, MenuItem, TextField, TextFieldProps, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface Option {
  value: string | number;
  icon: SvgIconComponent;
  name: string;
  color?: string;
}

type IconSelectWrapperProps = TextFieldProps & {
  name: string;
  options: Option[];
  loading?: boolean;
};

const IconSelectWrapper: React.FC<IconSelectWrapperProps> = ({
  name,
  options,
  loading,
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
    SelectProps: {
      renderValue: (selected: any) => {
        const selectedOption = options.find((opt) => opt.value === selected);
        if (!selectedOption) return selected as string;
        const IconComponent = selectedOption.icon;
        return (
          <Box display="flex" alignItems="center" style={{ color: selectedOption.color }}>
            <IconComponent fontSize="small" style={{ marginRight: 8, color: selectedOption.color }} />
            {selectedOption.name}
          </Box>
        );
      },
    },
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect}>
      {loading ? (
        <MenuItem disabled>
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} color="inherit" />
            <span>Loading...</span>
          </Box>
        </MenuItem>
      ) : options.length > 0 ? (
        options.map((item, pos) => {
          const IconComponent = item.icon;
          return (
            <MenuItem key={pos} value={item.value}>
              <Typography component="div" variant="subtitle2" display="flex" alignItems="center" style={{ color: item.color }}>
                <IconComponent fontSize="small" style={{ marginRight: 8, color: item.color }} />
                {item.name}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem disabled>No Data</MenuItem>
      )}
    </TextField>
  );
};

export default IconSelectWrapper;
