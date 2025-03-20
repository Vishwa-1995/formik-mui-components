import React from "react";
import { useField, useFormikContext } from "formik";
import { ListItemText, MenuItem, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

const MultipleSelectCheckmarksWrapper = ({ name, options, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (evt) => {
        const { value } = evt.target;

        // Transform the array of values into an array of objects
        const transformedArray = Array.isArray(value)
            ? value.map((item) => ({ value: item }))
            : typeof value === "number"
            ? value.toString().split(",").map((item) => ({ value: item }))
            : [];

        setFieldValue(name, transformedArray);
    };

    const configFormControl = {
        ...otherProps,
        variant: 'outlined',
        fullWidth: true,
        select: true,
        margin: 'dense',
        SelectProps: {
            multiple: true,
            value: field.value.map((obj) => obj.value),
            onChange: handleChange,
            renderValue: (selected) =>
                selected
                    .map((value) =>
                        options?.find((item) => item.value === value)?.label
                    )
                    .join(', ')
        },
    };

    if (meta && meta.touched && meta.error) {
        configFormControl.error = true;
        configFormControl.helperText = meta.error;
    }

    return (
        <TextField {...configFormControl}>
            {options.map((name, index) => (
                <MenuItem key={index} value={name.value}>
                    <Checkbox
                        checked={field.value.some(
                            (obj) => obj.value === name.value
                        )}
                    />
                    <ListItemText primary={name.label} />
                </MenuItem>
            ))}
        </TextField>
    );
};

export default MultipleSelectCheckmarksWrapper;
