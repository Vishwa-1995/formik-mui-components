import React, { useCallback, useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import {
  Autocomplete,
  AutocompleteProps,
  debounce,
  LinearProgress,
  TextField,
} from "@mui/material";

type AutoCompleteWrapperProps = {
  freeSolo: boolean;
  disabled: boolean;
  name: string;
  getOptions: (query: string) => Promise<any>;
  label: string;
  customHandleChange?: (data: any) => void;
} & Partial<AutocompleteProps<any, any, any, any>>;

const AutoCompleteWrapper: React.FC<AutoCompleteWrapperProps> = ({
  freeSolo,
  disabled,
  name,
  getOptions,
  customHandleChange,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, mata] = useField(name);

  const [options, setOptions] = useState<
    { label: string; value: number | string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchOption, setSearchOption] = useState("");

  useEffect(() => {
    fetchOptions(searchOption);
  }, [searchOption]);

  const fetchOptions = useCallback(
    debounce(async (query) => {
      setLoading(true);
      try {
        const response = await getOptions(query);
        const optionsData = response as {
          label: string;
          value: number | string;
        }[];
        setOptions(optionsData);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [getOptions]
  );

  const handleChange = (
    _: React.SyntheticEvent,
    value: { label: string; value: number | string } | string | null
  ) => {
    setFieldValue(name, value);
    customHandleChange && customHandleChange(value);
  };

  const handleInputChange = (
    _: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    setSearchOption(value.trim());
    if (!freeSolo && reason === "input") {
      setFieldValue(name, value);
      customHandleChange && customHandleChange(value);
    }
  };

  const configAutocomplete: any = {
    ...field,
    ...otherProps,
    variant: "outlined",
    fullWidth: true,
  };

  if (mata && mata.touched && mata.error) {
    configAutocomplete.error = true;
    configAutocomplete.helperText = mata.error;
  }

  return (
    <Autocomplete
      freeSolo={freeSolo}
      disabled={disabled}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      noOptionsText="No options"
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option?.label) {
          return option.label;
        }
        return "";
      }}
      isOptionEqualToValue={(option, value) => {
        if (typeof option === "string" || typeof value === "string") {
          return option === value;
        }
        return option?.value === value?.value;
      }}
      value={field.value || null}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            {...configAutocomplete}
            disabled={disabled}
            margin="dense"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: params.InputProps.endAdornment,
              },
            }}
          />
          {loading && <LinearProgress />}
        </>
      )}
    />
  );
};

export default AutoCompleteWrapper;
