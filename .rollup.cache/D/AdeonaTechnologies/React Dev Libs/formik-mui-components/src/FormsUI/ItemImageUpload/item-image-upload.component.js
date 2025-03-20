import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from "react";
import { FormField, } from "./item-image-upload.styles";
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useField, useFormikContext } from "formik";
import { Avatar, Badge, Box, Button, Divider, Typography } from "@mui/material";
import { IMAGE_SIZE } from "../../../../store/constants";
import { useTheme } from "@mui/material/styles";
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = IMAGE_SIZE;
const ItemImageUpload = ({ label, name, maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES, ...otherProps }) => {
    const theme = useTheme();
    const fileInputField = useRef(null);
    // const [files, setFiles] = useState({});
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const [url, setUrl] = useState(null);
    const handleUploadBtnClick = () => {
        fileInputField.current.click();
    };
    const handleNewFileUpload = (e) => {
        const { files: newFiles } = e.target;
        if (newFiles.length) {
            // console.log("file name", name);
            setFieldValue(name, newFiles[0]);
            setUrl(URL.createObjectURL(newFiles[0]));
        }
    };
    const removeFile = () => {
        delete field.value[0];
        setFieldValue(name, { ...field.value });
        setUrl(null);
    };
    useEffect(() => {
        if (field.value && typeof field.value.name === 'string') {
            setUrl(URL.createObjectURL(field.value));
        }
    }, []);
    return (_jsxs("div", { className: "row mb-4", children: [_jsxs("div", { className: "col-md-12", children: [_jsx(Typography, { variant: "body1", color: "textSecondary", textAlign: "center", children: label }), _jsxs(Box, { sx: {
                            mt: 2,
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                        }, children: [url && _jsx(Badge, { overlap: "circular", anchorOrigin: { vertical: 'top', horizontal: 'right' }, badgeContent: _jsx(CancelIcon, { onClick: () => removeFile() }), sx: { cursor: 'pointer', color: theme.palette.primary.main, mb: -2, width: 135, } }), _jsx(Avatar, { src: url, sx: {
                                    height: 130,
                                    mb: 2,
                                    width: 130,
                                    border: `5px solid ${theme.palette.primary[200]}`,
                                    color: theme.palette.primary[200]
                                } }), _jsx(Typography, { color: "secondary", variant: "caption", style: { textAlign: 'center' }, children: "Select an image file on your computer (2MB max)" })] }), _jsx(Divider, { sx: { m: 2, borderBottomWidth: 1, borderBottomColor: theme.palette.primary.main } }), _jsx(Button, { color: "primary", fullWidth: true, variant: "outlined", type: "button", onClick: handleUploadBtnClick, disabled: otherProps.disabled, startIcon: _jsx(CloudUploadIcon, {}), children: "Upload picture" }), _jsx(FormField, { type: "file", ref: fileInputField, onChange: handleNewFileUpload, title: "", value: "", ...otherProps })] }), _jsx("div", { className: "col-md-12", children: meta && meta.error ? _jsx(Typography, { variant: "caption", color: 'error', children: meta.error }) : null })] }));
};
export default ItemImageUpload;
//# sourceMappingURL=item-image-upload.component.js.map