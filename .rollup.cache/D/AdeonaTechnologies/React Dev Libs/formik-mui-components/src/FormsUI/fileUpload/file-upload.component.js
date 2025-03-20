import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, } from "react";
import { FileUploadContainer, FormField, DragDropText, UploadFileBtn, FilePreviewContainer, ImagePreview, PreviewContainer, PreviewList, FileMetaData, RemoveFileIcon, VideoPreview } from "./file-upload.styles";
import { useField, useFormikContext } from "formik";
import { Badge, Box, Typography } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import ImageCropper, { closeImageCropper, openImageCropper } from "./imageCropper";
import { _setImage } from "../../../utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CropIcon from '@mui/icons-material/Crop';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Grid from "@mui/material/Grid";
import CancelIcon from "@mui/icons-material/Cancel";
import { openFileViewer } from "../../FileViewer";
import { useTheme } from "@mui/material/styles";
import { IMAGE_SIZE } from "../../../../store/constants";
const KILO_BYTES_PER_BYTE = 1024;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = IMAGE_SIZE;
export const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);
export const convertBytesToMB = (bytes) => Math.round(bytes / (KILO_BYTES_PER_BYTE * KILO_BYTES_PER_BYTE));
function LinearProgressWithLabel(props) {
    return (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Box, { sx: { width: '100%', mr: 1 }, children: _jsx(LinearProgress, { variant: "determinate", ...props }) }), _jsx(Box, { sx: { minWidth: 35 }, children: _jsx(Typography, { variant: "body2", sx: { color: 'text.secondary' }, children: `${Math.round(props.value)}%` }) })] }));
}
const FileUpload = ({ label, name, maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES, progress, ...otherProps }) => {
    const theme = useTheme();
    const fileInputField = useRef(null);
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const handleUploadBtnClick = () => {
        fileInputField.current.click();
    };
    const addNewFiles = (newFiles) => {
        let totalFileSize = field.value?.reduce((accumulator, curValue) => {
            return accumulator + curValue.size;
        }, 0);
        for (let file of newFiles) {
            totalFileSize += file.size;
            if (totalFileSize <= maxFileSizeInBytes) {
                if (!otherProps.multiple) {
                    return [file];
                }
                field.value = [...field.value, file];
            }
        }
        return [...field.value];
    };
    useEffect(() => {
        if (field.value && typeof field.value.name == 'string') {
            let updatedFiles = addNewFiles([field.value]);
            setFieldValue(name, updatedFiles);
        }
    }, [field.value]);
    const handleNewFileUpload = (e) => {
        const { files: newFiles } = e.target;
        if (newFiles.length) {
            let updatedFiles = addNewFiles(newFiles);
            setFieldValue(name, updatedFiles);
        }
    };
    const removeFile = (fileIndex) => {
        field.value.splice(fileIndex, 1);
        setFieldValue(name, field.value);
    };
    // Generating Cropped Image When Done Button Clicked
    const onCropDone = (imgCroppedArea, image, fileName) => {
        const canvasEle = document.createElement("canvas");
        canvasEle.width = imgCroppedArea.width;
        canvasEle.height = imgCroppedArea.height;
        const context = canvasEle.getContext("2d");
        let imageObj1 = new Image();
        imageObj1.src = image;
        imageObj1.onload = function () {
            context.drawImage(imageObj1, imgCroppedArea.x, imgCroppedArea.y, imgCroppedArea.width, imgCroppedArea.height, 0, 0, imgCroppedArea.width, imgCroppedArea.height);
            const dataURL = canvasEle.toDataURL();
            _setImage(dataURL, fileName).then((value => {
                let updatedField = field.value.map(obj => obj.name === fileName ? value : obj);
                setFieldValue(name, updatedField);
                closeImageCropper();
            }));
        };
    };
    // Handle Cancel Button Click
    const onCropCancel = () => {
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Grid, { container: true, direction: "row", children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(Typography, { variant: "body2", color: "textSecondary", children: label }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(FileUploadContainer, { children: [_jsx(DragDropText, { children: "Drag and drop your files anywhere or" }), _jsxs(UploadFileBtn, { type: "button", onClick: handleUploadBtnClick, disabled: otherProps.disabled, children: [_jsx(FileUploadIcon, { sx: { fontSize: '20px' } }), _jsxs("span", { children: [" Select ", otherProps.multiple ? "files" : "a file"] })] }), _jsx(FormField, { type: "file", ref: fileInputField, onChange: handleNewFileUpload, title: "", value: "", ...otherProps })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(FilePreviewContainer, { children: _jsx(PreviewList, { children: field.value?.map((file, index) => {
                                    const allowedTypes = [
                                        "text/csv", // CSV file
                                        "application/vnd.ms-excel", // Old Excel (.xls)
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // New Excel (.xlsx)
                                    ];
                                    let isPdfFile = file?.type === "application/pdf";
                                    let isExcelFile = allowedTypes.includes(file.type);
                                    let isImageFile = file?.type?.split("/")[0] === "image";
                                    let isVideoFile = file?.type?.split("/")[0] === "video";
                                    return (_jsxs(Grid, { container: true, spacing: 2, marginTop: 0.2, children: [_jsxs(Grid, { item: true, children: [URL.createObjectURL(file) && _jsx(Badge, { overlap: "circular", anchorOrigin: { vertical: 'top', horizontal: 'right' }, badgeContent: _jsx(CancelIcon, { color: "primary", onClick: () => removeFile(index) }), sx: { cursor: 'pointer', color: 'var(--primary-color)', display: 'flex' } }), _jsx(PreviewContainer, { children: _jsxs(Box, { children: [isPdfFile && (_jsx(ImagePreview, { src: 'https://dsuabgmmtxmj1.cloudfront.net/common/pdf_file_icon.png', alt: `file preview ${index}` })), isExcelFile && (_jsx(ImagePreview, { src: 'https://cdn.adeonatech.net/common/ms-excel.png', alt: `file preview ${index}` })), isImageFile && (_jsx(ImagePreview, { src: URL.createObjectURL(file), alt: `file preview ${index}` })), isVideoFile && (_jsx(VideoPreview, { alt: `file preview ${index}`, autoplay: true, muted: true, children: _jsx("source", { src: URL.createObjectURL(file), type: file?.type }) })), _jsxs(FileMetaData, { isPdfFile: isPdfFile, isImageFile: isImageFile, isVideoFile: isVideoFile, isExcelFile: isExcelFile, children: [_jsx(Typography, { width: 100, color: 'white', variant: "subtitle2", style: {
                                                                                wordWrap: 'break-word',
                                                                                fontWeight: 'bold'
                                                                            }, children: (((file.name).substring(0, 30)) + (file.name.length > 30 ? '...' : '')) }), _jsxs("aside", { children: [_jsxs(Typography, { width: 100, color: 'white', variant: "subtitle2", children: [convertBytesToKB(file.size), " kb"] }), _jsxs("aside", { children: [_jsx(RemoveFileIcon, { color: 'inherit', size: 'small', onClick: () => {
                                                                                                openFileViewer(file);
                                                                                            }, children: _jsx(VisibilityIcon, {}) }), isImageFile && _jsx(RemoveFileIcon, { color: 'secondary', size: 'small', onClick: () => {
                                                                                                openImageCropper(URL.createObjectURL(file), file.name, onCropDone, onCropCancel);
                                                                                            }, children: _jsx(CropIcon, {}) })] })] })] })] }) })] }), _jsx(Grid, { item: true, xs: 9.5, display: "flex", justifyContent: "center", alignItems: "center", children: _jsxs(Grid, { container: true, children: [_jsx(Typography, { variant: "subtitle2", color: theme.palette.dark.main, children: (((file.name).substring(0, 30)) + (file.name.length > 30 ? '...' : '')) }), _jsx(Box, { sx: { width: '100%' }, children: _jsx(LinearProgressWithLabel, { value: progress }) }), _jsx(Grid, { item: true, xs: 6, children: _jsxs(Typography, { variant: "h6", color: "grey", children: [convertBytesToKB(file.size), " kb of ", convertBytesToMB(maxFileSizeInBytes), " MB "] }) }), _jsxs(Grid, { item: true, xs: 6, display: "flex", justifyContent: "flex-end", alignItems: "flex-end", children: [isImageFile && _jsx(Typography, { variant: "h6", color: "primary", sx: { cursor: "pointer", marginX: 1 }, onClick: () => {
                                                                        openImageCropper(URL.createObjectURL(file), file.name, onCropDone, onCropCancel);
                                                                    }, children: "Crop" }), !isExcelFile && _jsx(Typography, { variant: "h6", color: "primary", sx: { cursor: "pointer", marginX: 1 }, onClick: () => {
                                                                        openFileViewer(file);
                                                                    }, children: "View" })] })] }) })] }, file.name));
                                }) }) }) }), _jsx(Grid, { item: true, xs: 12, children: meta && meta.error ? _jsx(Typography, { variant: "caption", color: 'error', children: meta.error }) : null })] }), _jsx(ImageCropper, {})] }));
};
export default FileUpload;
//# sourceMappingURL=file-upload.component.js.map