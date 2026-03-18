import React from "react";
import { useField, useFormikContext } from "formik";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

interface Option {
  value: string | number;
  label: string;
  image?: string;
  color?: string;
}

type SelectWrapperProps = TextFieldProps & {
  name: string;
  options: Option[];
  customHandleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withImage?: boolean;
  loading?: boolean;
};

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  name,
  options,
  customHandleChange,
  withImage,
  loading,
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
    SelectProps: {
      renderValue: (selected: any) => {
        const selectedOption = options.find((opt) => opt.value === selected);
        if (!withImage || !selectedOption) {
          return selectedOption ? selectedOption.label : selected;
        }

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {selectedOption.image ? (
              <img
                src={selectedOption.image}
                alt={selectedOption.label}
                style={{
                  width: "25px",
                  height: "25px",
                  marginRight: "10px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <ImageIcon
                style={{
                  width: "25px",
                  height: "25px",
                  marginRight: "10px",
                  color: "#bdbdbd",
                }}
              />
            )}
            <span style={{ color: selectedOption.color }}>{selectedOption.label}</span>
          </div>
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
        <MenuItem disabled>Loading...</MenuItem>
      ) : options.length > 0 ? (
        options.map((item, pos) => (
          <MenuItem key={pos} value={item.value}>
            {withImage &&
              (item.image ? (
                <img
                  src={item.image}
                  alt={item.label}
                  style={{
                    width: "25px",
                    height: "25px",
                    marginRight: "10px",
                    borderRadius: "4px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <ImageIcon
                  style={{
                    width: "25px",
                    height: "25px",
                    marginRight: "10px",
                    color: "#bdbdbd",
                  }}
                />
              ))}
            <span style={{ color: item.color }}>{item.label}</span>
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No Data</MenuItem>
      )}
    </TextField>
  );
};

export default SelectWrapper;
