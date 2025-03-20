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
  customHandleChange?: () => void;
} & Partial<AutocompleteProps<any, any, any, any>>;

const AutoCompleteWrapper: React.FC<AutoCompleteWrapperProps> = ({
  freeSolo,
  disabled,
  name,
  getOptions,
  customHandleChange,
  ...otherProps // Capture unknown props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, mata] = useField(name);

  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
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
        const optionsData = (response as { name: string; id: number }[])?.map(
          (e) => ({
            label: e.name,
            value: e.id,
          })
        );
        setOptions(optionsData);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce delay
    []
  );

  const handleChange = (event, value) => {
    setFieldValue(name, value);
    customHandleChange && customHandleChange();
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
      onInputChange={(event, value) => {
        setSearchOption(value);
      }}
      options={options}
      noOptionsText="No options"
      getOptionLabel={(option: any) => option?.label || option}
      isOptionEqualToValue={() => true}
      value={field.value || null}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            {...configAutocomplete}
            disabled={disabled}
            margin="dense"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
          {loading && <LinearProgress />}
        </>
      )}
    />
  );
};

export default AutoCompleteWrapper;
