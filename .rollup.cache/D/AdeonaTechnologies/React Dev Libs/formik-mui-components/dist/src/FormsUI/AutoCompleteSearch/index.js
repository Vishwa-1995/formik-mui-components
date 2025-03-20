import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useField, useFormikContext } from "formik";
import { Autocomplete, debounce, LinearProgress, TextField } from "@mui/material";
export default function AutoCompleteSearchWrapper(props) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(props.name);
    function handleTextFieldBlur(e) {
        setFieldValue(field.name, props.useQueryResult.data?.find((option) => option.label === e.target.value) ?? { value: 0, label: "" });
    }
    const configTextField = {
        error: false,
        helperText: "",
    };
    if (meta && meta.touched && meta.error) {
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }
    return (_jsx(Autocomplete, { sx: { mt: 1 }, isOptionEqualToValue: () => true, disabled: props.disabled, noOptionsText: "Search not found", options: props.useQueryResult.data ?? [], value: field.value, getOptionLabel: (option) => option.label, loading: props.useQueryResult.isFetching, onChange: (_, newValue) => setFieldValue(field.name, newValue), onInputChange: debounce((_, newInputValue) => {
            props.setInputValue(newInputValue === "" ? undefined : newInputValue.slice(0, 10).trim());
        }, 300), renderInput: (params) => (_jsxs(_Fragment, { children: [_jsx(TextField, { ...params, variant: "outlined", fullWidth: true, name: field.name, onBlur: (e) => {
                        field.onBlur(e);
                        handleTextFieldBlur(e);
                    }, ...configTextField, label: props.label, disabled: props.disabled, InputProps: {
                        ...params.InputProps,
                        endAdornment: _jsx(_Fragment, { children: params.InputProps.endAdornment }),
                    } }), props.useQueryResult.isLoading && _jsx(LinearProgress, {})] })) }));
}
//# sourceMappingURL=index.js.map