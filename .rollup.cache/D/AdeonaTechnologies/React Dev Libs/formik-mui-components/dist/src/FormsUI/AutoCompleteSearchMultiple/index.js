import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { useField, useFormikContext } from "formik";
import { Autocomplete, debounce, TextField, } from "@mui/material";
const AutoCompleteSearchMultipleWrapper = ({ name, label, useQueryResult, setInputValue, disabled, ...otherProps // Capture unknown props
 }) => {
    const { setFieldValue, values } = useFormikContext();
    const [field, meta] = useField(name);
    const [prevValues, setPrevValues] = React.useState([
        ...field.value,
    ]);
    const configTextField = {
        ...field,
        ...otherProps,
        error: false,
        helperText: "",
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (_jsx(Autocomplete, { multiple: true, limitTags: 2, freeSolo: false, clearOnBlur: false, disabled: disabled, disableCloseOnSelect: true, filterSelectedOptions: false, noOptionsText: "Search not found", options: useQueryResult.data ?? [], getOptionLabel: (option) => option?.label || option, loading: useQueryResult.isFetching, isOptionEqualToValue: (option, value) => {
            if (!option || !value)
                return false;
            return option.value === value.value;
        }, value: typeof field.value === "string" ? [...prevValues] : [...field.value], onChange: (_, newValue, reason) => {
            if (typeof newValue !== "string" &&
                (reason === "selectOption" || reason === "removeOption")) {
                let uniqueValues;
                if (reason === "selectOption") {
                    uniqueValues = [...field.value, newValue.at(-1)].filter((v, i, arr) => arr.findIndex((o) => o?.value === v?.value) === i);
                }
                else if (reason === "removeOption") {
                    uniqueValues = newValue;
                }
                setFieldValue(field.name, uniqueValues);
            }
        }, onInputChange: debounce((_, newInputValue, reason) => {
            if (reason === "input") {
                if (values && typeof values[field.name] !== "string") {
                    setFieldValue(field.name, values[field.name]);
                    setPrevValues(values[field.name]);
                }
                setInputValue(newInputValue === "" ? undefined : newInputValue.slice(0, 10).trim());
            }
        }, 300), 
        // filterOptions={(options, state) => {
        //   if (state.inputValue) {
        //     return options.filter((option) =>
        //       option.label.toLowerCase().includes(state.inputValue.toLowerCase())
        //     );
        //   }
        //   return options;
        // }}
        renderInput: (params) => (_jsx(TextField, { ...params, ...configTextField, label: label, placeholder: "Select Batches", 
            // onBlur={(e) => {
            //   const isValidSelection = useQueryResult.data?.some(
            //     (option) => option.label === e.target.value
            //   );
            //   if (!isValidSelection) {
            //     setInputValue(undefined);
            //   }
            // }}
            onKeyDown: (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            } })), sx: { mt: 1 } }));
};
export default AutoCompleteSearchMultipleWrapper;
//# sourceMappingURL=index.js.map