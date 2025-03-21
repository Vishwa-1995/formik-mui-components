import React from "react";
import { useField, useFormikContext } from "formik";
import {
  Autocomplete,
  AutocompleteProps,
  debounce,
  TextField,
} from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
type Option = {
  value: string | number;
  label: string;
};

type AutoCompleteSearchMultipleWrapperProps = {
  name: string;
  label: string;
  useQueryResult: UseQueryResult<Option[], Error>;
  setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
} & Partial<AutocompleteProps<any, any, any, any>>;

const AutoCompleteSearchMultipleWrapper: React.FC<
  AutoCompleteSearchMultipleWrapperProps
> = ({
  name,
  label,
  useQueryResult,
  setInputValue,
  disabled,
  ...otherProps // Capture unknown props
}) => {
  const { setFieldValue } = useFormikContext();
  const values = useFormikContext().values as { [key: string]: any };
  const [field, meta] = useField<Option[]>(name);
  const [prevValues, setPrevValues] = React.useState<Option[]>([
    ...field.value,
  ]);

  const { onChange, ...configTextField } = {
    ...field,
    ...otherProps,
    error: false,
    color: "primary" as const,
    helperText: "",
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return (
    <Autocomplete
      multiple
      limitTags={2}
      freeSolo={false}
      clearOnBlur={false}
      disabled={disabled}
      disableCloseOnSelect={true}
      filterSelectedOptions={false}
      noOptionsText="Search not found"
      options={useQueryResult.data ?? []}
      getOptionLabel={(option: any) => option?.label || option}
      loading={useQueryResult.isFetching}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option.value === value.value;
      }}
      value={
        typeof field.value === "string" ? [...prevValues] : [...field.value]
      }
      onChange={(_, newValue, reason) => {
        if (
          typeof newValue !== "string" &&
          (reason === "selectOption" || reason === "removeOption")
        ) {
          let uniqueValues;
          if (reason === "selectOption") {
            uniqueValues = [...field.value, newValue.at(-1)].filter(
              (v, i, arr) => arr.findIndex((o) => o?.value === v?.value) === i
            );
          } else if (reason === "removeOption") {
            uniqueValues = newValue;
          }

          setFieldValue(field.name, uniqueValues);
        }
      }}
      onInputChange={debounce((_, newInputValue, reason) => {
        if (reason === "input") {
          if (values && typeof values[field.name] !== "string") {
            setFieldValue(field.name, values[field.name]);
            setPrevValues(values[field.name]);
          }
          setInputValue(
            newInputValue === "" ? undefined : newInputValue.slice(0, 10).trim()
          );
        }
      }, 300)}
      // filterOptions={(options, state) => {
      //   if (state.inputValue) {
      //     return options.filter((option) =>
      //       option.label.toLowerCase().includes(state.inputValue.toLowerCase())
      //     );
      //   }
      //   return options;
      // }}
      renderInput={(params: any) => (
        <TextField
          {...params}
          {...configTextField}
          label={label}
          placeholder="Select Batches"
          onFocus={params.onFocus as React.FocusEventHandler<HTMLInputElement>}
          // onBlur={(e) => {
          //   const isValidSelection = useQueryResult.data?.some(
          //     (option) => option.label === e.target.value
          //   );
          //   if (!isValidSelection) {
          //     setInputValue(undefined);
          //   }
          // }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        />
      )}
      sx={{ mt: 1 }}
    />
  );
};

export default AutoCompleteSearchMultipleWrapper;
