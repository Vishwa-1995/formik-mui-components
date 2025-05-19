import React from "react";
import { useField, useFormikContext } from "formik";
import {
  Autocomplete,
  debounce,
  LinearProgress,
  TextField,
} from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";

export default function AutoCompleteSearchWrapper<
  Option extends { value: string | number; label: string }
>(
  props: Readonly<{
    name: string;
    label: string;
    useQueryResult: UseQueryResult<Option[], Error>;
    setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
    disabled?: boolean;
  }>
) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<Option>(props.name);

  function handleTextFieldBlur(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    setFieldValue(
      field.name,
      props.useQueryResult.data?.find(
        (option) => option.label === target.value
      ) ?? { value: 0, label: "" }
    );
  }

  const configTextField = {
    error: false,
    helperText: "",
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <Autocomplete<Option>
      sx={{ mt: 1 }}
      isOptionEqualToValue={() => true}
      disabled={props.disabled}
      noOptionsText="Search not found"
      options={props.useQueryResult.data ?? []}
      value={field.value}
      getOptionLabel={(option) => option.label}
      loading={props.useQueryResult.isFetching}
      onChange={(_, newValue) => setFieldValue(field.name, newValue)}
      onInputChange={debounce((_, newInputValue) => {
        props.setInputValue(
          newInputValue === "" ? undefined : newInputValue.slice(0, 10).trim()
        );
      }, 300)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          name={field.name}
          onBlur={(e) => {
            field.onBlur(e);
            handleTextFieldBlur(e);
          }}
          {...configTextField}
          label={props.label}
          disabled={props.disabled}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                {props.useQueryResult.isLoading && <LinearProgress />}
              </>
            ),
          }}
        />
      )}
    />
  );
}
