import React, { useEffect, useRef, } from "react";
import {
    FileUploadContainer,
    FormField,
    DragDropText,
    UploadFileBtn,
    FilePreviewContainer,
    ImagePreview,
    PreviewContainer,
    PreviewList,
    FileMetaData,
    RemoveFileIcon,
    VideoPreview
} from "./file-upload.styles";
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
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

const FileUpload = ({
    label,
    name,
    maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
    progress,
    ...otherProps
}) => {
    const theme = useTheme();
    const fileInputField = useRef(null);
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleUploadBtnClick = () => {
        fileInputField.current.click();
    };

    const addNewFiles = (newFiles) => {
        let totalFileSize = field.value?.reduce(
            (accumulator, curValue) => {
                return accumulator + curValue.size
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
    }, [field.value])

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
            context.drawImage(
                imageObj1,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );

            const dataURL = canvasEle.toDataURL();

            _setImage(
                dataURL,
                fileName
            ).then((value => {
                let updatedField = field.value.map(obj => obj.name === fileName ? value : obj);
                setFieldValue(name, updatedField);
                closeImageCropper();
            }));
        };
    };

    // Handle Cancel Button Click
    const onCropCancel = () => {
    };

    return (
        <>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                        {label}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FileUploadContainer>
                        <DragDropText>Drag and drop your files anywhere or</DragDropText>
                        <UploadFileBtn type="button" onClick={handleUploadBtnClick}
                            disabled={otherProps.disabled}>
                            <FileUploadIcon sx={{ fontSize: '20px' }} />
                            <span> Select {otherProps.multiple ? "files" : "a file"}</span>
                        </UploadFileBtn>
                        <FormField
                            type="file"
                            ref={fileInputField}
                            onChange={handleNewFileUpload}
                            title=""
                            value=""
                            {...otherProps}
                        />
                    </FileUploadContainer>
                </Grid>
                <Grid item xs={12}>
                    <FilePreviewContainer>
                        {/* <span>To Upload</span> */}
                        <PreviewList>
                            {field.value?.map((file, index) => {

                                const allowedTypes = [
                                    "text/csv",                    // CSV file
                                    "application/vnd.ms-excel",     // Old Excel (.xls)
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // New Excel (.xlsx)
                                ];
                                let isPdfFile = file?.type === "application/pdf";
                                let isExcelFile = allowedTypes.includes(file.type);
                                let isImageFile = file?.type?.split("/")[0] === "image";
                                let isVideoFile = file?.type?.split("/")[0] === "video";
                                return (
                                    <Grid container key={file.name} spacing={2} marginTop={0.2}>
                                        <Grid item>
                                            {URL.createObjectURL(file) && <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                badgeContent={
                                                    <CancelIcon color="primary" onClick={() => removeFile(index)} />
                                                }
                                                sx={{ cursor: 'pointer', color: 'var(--primary-color)', display: 'flex' }}
                                            />
                                            }
                                            <PreviewContainer>
                                                <Box>
                                                    {isPdfFile && (
                                                        <ImagePreview
                                                            src='https://dsuabgmmtxmj1.cloudfront.net/common/pdf_file_icon.png'
                                                            alt={`file preview ${index}`}
                                                        />
                                                    )}
                                                    {isExcelFile && (
                                                        <ImagePreview
                                                            src='https://cdn.adeonatech.net/common/ms-excel.png'
                                                            alt={`file preview ${index}`}
                                                        />
                                                    )}
                                                    {isImageFile && (
                                                        <ImagePreview
                                                            src={URL.createObjectURL(file)}
                                                            alt={`file preview ${index}`}
                                                        />
                                                    )}
                                                    {isVideoFile && (
                                                        <VideoPreview
                                                            alt={`file preview ${index}`}
                                                            autoplay muted
                                                        >
                                                            <source src={URL.createObjectURL(file)}
                                                                type={file?.type}></source>
                                                        </VideoPreview>
                                                    )}
                                                    <FileMetaData isPdfFile={isPdfFile} isImageFile={isImageFile}
                                                        isVideoFile={isVideoFile} isExcelFile={isExcelFile}>
                                                        <Typography
                                                            width={100} color='white'
                                                            variant="subtitle2"
                                                            style={{
                                                                wordWrap: 'break-word',
                                                                fontWeight: 'bold'
                                                            }}>{(((file.name).substring(0, 30)) + (file.name.length > 30 ? '...' : ''))}</Typography>
                                                        <aside>
                                                            <Typography
                                                                width={100} color='white'
                                                                variant="subtitle2">{convertBytesToKB(file.size)} kb</Typography>
                                                            <aside>
                                                                {/*<RemoveFileIcon*/}
                                                                {/*    color='secondary'*/}
                                                                {/*    size='small'*/}
                                                                {/*    onClick={() => removeFile(fileName)}*/}
                                                                {/*><DeleteIcon/></RemoveFileIcon>*/}
                                                                <RemoveFileIcon
                                                                    color='inherit'
                                                                    size='small'
                                                                    onClick={() => {
                                                                        openFileViewer(file)
                                                                    }}
                                                                ><VisibilityIcon /></RemoveFileIcon>
                                                                {isImageFile && <RemoveFileIcon
                                                                    color='secondary'
                                                                    size='small'
                                                                    onClick={() => {
                                                                        openImageCropper(
                                                                            URL.createObjectURL(file),
                                                                            file.name,
                                                                            onCropDone,
                                                                            onCropCancel
                                                                        )
                                                                    }}
                                                                ><CropIcon /></RemoveFileIcon>}
                                                            </aside>
                                                        </aside>
                                                    </FileMetaData>
                                                </Box>
                                            </PreviewContainer>
                                        </Grid>
                                        <Grid item xs={9.5} display="flex" justifyContent="center" alignItems="center">
                                            <Grid container>
                                                <Typography variant="subtitle2" color={theme.palette.dark.main}>{(((file.name).substring(0, 30)) + (file.name.length > 30 ? '...' : ''))}</Typography>
                                                <Box sx={{ width: '100%' }}>
                                                    <LinearProgressWithLabel value={progress} />
                                                </Box>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6" color="grey">{convertBytesToKB(file.size)} kb of {convertBytesToMB(maxFileSizeInBytes)} MB </Typography>
                                                </Grid>
                                                <Grid item xs={6} display="flex" justifyContent="flex-end" alignItems="flex-end">
                                                    {isImageFile && <Typography variant="h6" color="primary" sx={{ cursor: "pointer", marginX: 1 }} onClick={() => {
                                                        openImageCropper(
                                                            URL.createObjectURL(file),
                                                            file.name,
                                                            onCropDone,
                                                            onCropCancel
                                                        )
                                                    }}>Crop</Typography>}
                                                    {!isExcelFile && <Typography variant="h6" color="primary" sx={{ cursor: "pointer", marginX: 1 }} onClick={() => {
                                                        openFileViewer(file)
                                                    }}>View</Typography>}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </PreviewList>
                    </FilePreviewContainer>
                </Grid>
                <Grid item xs={12}>
                    {meta && meta.error ? <Typography variant="caption" color='error'>{meta.error}</Typography> : null}
                </Grid>
            </Grid>
            <ImageCropper />
        </>
    );
}
    ;

export default FileUpload;