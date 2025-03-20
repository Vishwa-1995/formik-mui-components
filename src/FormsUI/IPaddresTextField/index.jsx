import {useField, useFormikContext} from "formik";
import {MenuItem, TextField} from "@mui/material";
import React from "react";

const IPAddressTextFieldWrapper = ({
                                       name,
                                       ...otherProps
                                   }) => {
    const {setFieldValue} = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = evt => {
        const newValue = evt.target.value;

        const regex = /^[0-9.\b]+$/;
        let length = newValue?.length;
        let index = newValue?.lastIndexOf('.') + 1;
        let noOfDots = newValue?.split('.').length - 1;
        let updateVal = '123';
        if (!regex.test(newValue)) {
            updateVal = '';
        } else if (length !== index && noOfDots < 3 && field?.value?.length < length && (length - index) % 3 === 0) {
            updateVal = newValue + '.';
        } else if (noOfDots > 3 || length - index > 3) {
            updateVal = newValue?.substring(0, length - 1);
        } else {
            updateVal = newValue;
        }

        setFieldValue(name, updateVal);
    };

    const configSelect = {
        ...field,
        ...otherProps,
        variant: 'outlined',
        fullWidth: true,
        margin: "dense",
        onChange: handleChange
    };

    if (meta && meta.touched && meta.error) {
        configSelect.error = true;
        configSelect.helperText = meta.error;
    }

    return (
        <TextField {...configSelect} margin="dense"/>
    );
};

export default IPAddressTextFieldWrapper;