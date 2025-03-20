import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import { Autocomplete, debounce, LinearProgress, TextField, } from "@mui/material";
const AutoCompleteWrapper = ({ freeSolo, disabled, name, getOptions, customHandleChange, ...otherProps // Capture unknown props
 }) => {
    const { setFieldValue } = useFormikContext();
    const [field, mata] = useField(name);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchOption, setSearchOption] = useState("");
    useEffect(() => {
        fetchOptions(searchOption);
    }, [searchOption]);
    const fetchOptions = useCallback(debounce(async (query) => {
        setLoading(true);
        try {
            const response = await getOptions(query);
            const optionsData = response?.map((e) => ({
                label: e.name,
                value: e.id,
            }));
            setOptions(optionsData);
        }
        catch (error) {
            console.error("Error fetching options:", error);
        }
        finally {
            setLoading(false);
        }
    }, 500), // 500ms debounce delay
    []);
    const handleChange = (event, value) => {
        setFieldValue(name, value);
        customHandleChange && customHandleChange();
    };
    const configAutocomplete = {
        ...field,
        ...otherProps,
        variant: "outlined",
        fullWidth: true,
    };
    if (mata && mata.touched && mata.error) {
        configAutocomplete.error = true;
        configAutocomplete.helperText = mata.error;
    }
    return (_jsx(Autocomplete, { freeSolo: freeSolo, disabled: disabled, onChange: handleChange, onInputChange: (event, value) => {
            setSearchOption(value);
        }, options: options, noOptionsText: "No options", getOptionLabel: (option) => option?.label || option, isOptionEqualToValue: () => true, value: field.value || null, renderInput: (params) => (_jsxs(_Fragment, { children: [_jsx(TextField, { ...params, ...configAutocomplete, disabled: disabled, margin: "dense", InputProps: {
                        ...params.InputProps,
                        endAdornment: _jsx(_Fragment, { children: params.InputProps.endAdornment }),
                    } }), loading && _jsx(LinearProgress, {})] })) }));
};
export default AutoCompleteWrapper;
//# sourceMappingURL=index.js.map