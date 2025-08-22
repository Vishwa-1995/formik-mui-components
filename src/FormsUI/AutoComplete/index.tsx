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
  required?: boolean;
  freeSolo: boolean;
  disabled: boolean;
  name: string;
  getOptions: (query: string) => Promise<any>;
  label: string;
  customHandleChange?: (data: any) => void;
} & Partial<AutocompleteProps<any, any, any, any>>;

const AutoCompleteWrapper: React.FC<AutoCompleteWrapperProps> = ({
  required,
  freeSolo,
  disabled,
  name,
  getOptions,
  customHandleChange,
  ...otherProps
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, mata] = useField(name);
  const [showOptions, setShowOptions] = useState(true);

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
    if (typeof value === "string") {
      setFieldValue(name, { label: value.toString(), value: "" });
    } else {
      setFieldValue(name, value);
    }
    setShowOptions(false);
    customHandleChange && customHandleChange(value);
  };

  const handleInputChange = (
    _: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    setSearchOption(value.trim());
    setShowOptions(true);
    if (!freeSolo && reason === "input") {
      setFieldValue(name, { label: value.toString(), value: "" });
      customHandleChange && customHandleChange(value);
    }
  };

  const configAutocomplete: any = {
    // ...field,
    ...otherProps,
    variant: "outlined",
    fullWidth: true,
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFieldTouched(name, true);
    setShowOptions(false);
  };

  // Handle error message extraction with proper null checking
  const getErrorMessage = (): string => {
    if (!mata.error) return "";

    if (typeof mata.error === "object") {
      // Check if it's an object with a value property
      return (mata.error as any)?.value || "Invalid value";
    }

    return mata.error;
  };

  const hasError = Boolean(mata.touched && mata.error);
  const errorMessage = hasError ? getErrorMessage() : "";

  return (
    <Autocomplete
      freeSolo={freeSolo}
      disabled={disabled}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onBlur={handleBlur}
      options={options}
      noOptionsText={freeSolo ? "No options" : ""}
      open={freeSolo ? undefined : options.length > 0 && showOptions}
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
            required={required}
            {...params}
            {...configAutocomplete}
            disabled={disabled}
            margin="dense"
            error={hasError}
            helperText={errorMessage}
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
