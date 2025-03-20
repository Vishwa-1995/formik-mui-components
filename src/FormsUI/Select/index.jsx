import React from 'react';
import { useField, useFormikContext } from 'formik';
import { MenuItem, TextField } from '@mui/material';

const SelectWrapper = ({
    name,
    options,
    customHandleChange,
    ...otherProps
}) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = evt => {
        const { value } = evt.target;
        setFieldValue(name, value);
    };

    const configSelect = {
        ...field,
        ...otherProps,
        variant: 'outlined',
        fullWidth: true,
        select: true,
        margin: "dense",
        onChange: customHandleChange || handleChange
    };

    if (meta && meta.touched && meta.error) {
        configSelect.error = true;
        configSelect.helperText = meta.error;
    }

    return (
        <TextField {...configSelect}>
            {options.length > 0 ? options.map((item, pos) => {
                return (
                    <MenuItem key={pos} value={item.value}>
                        {item.label}
                    </MenuItem>
                )
            }) :
                <MenuItem disabled>
                    No Data
                </MenuItem>
            }
        </TextField>
    );
};

export default SelectWrapper;