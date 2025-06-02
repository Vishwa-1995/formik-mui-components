import { useRef } from "react";
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
  VideoPreview,
} from "./file-upload.styles";
import { useField, useFormikContext } from "formik";
import { Badge, Box, Grid, Typography } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import ImageCropper, {
  closeImageCropper,
  openImageCropper,
} from "./imageCropper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CropIcon from "@mui/icons-material/Crop";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { openFileViewer } from "./FileViewer";
import { useTheme } from "@mui/material/styles";
import { JSX } from "react/jsx-runtime";

interface FileUploadProps {
  label: string;
  name: string;
  maxFileSizeInBytes?: number;
  progress?: number;
  onUpload?: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  accept?: string;
  // Add any other props you need
}

export const _setImage = async (
  src: string,
  filename: string
): Promise<File | {}> => {
  try {
    if (src) {
      const response = await fetch(src);
      const blobFile = await response.blob();
      return new File([blobFile], filename, { type: blobFile.type });
    } else {
      return {};
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};

const KILO_BYTES_PER_BYTE = 1024;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 2097152;

export const convertBytesToKB = (bytes: number) =>
  Math.round(bytes / KILO_BYTES_PER_BYTE);
export const convertBytesToMB = (bytes: number) =>
  Math.round(bytes / (KILO_BYTES_PER_BYTE * KILO_BYTES_PER_BYTE));

function LinearProgressWithLabel(
  props: (JSX.IntrinsicAttributes & LinearProgressProps) | any
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {`${Math.round(props?.value)}%`}
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
  onUpload,
  ...otherProps
}: FileUploadProps) => {
  const theme = useTheme();
  const fileInputField: any = useRef(null);
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleUploadBtnClick = () => {
    fileInputField?.current.click();
  };

  const addNewFiles = (newFiles: any) => {
    let totalFileSize = field.value?.reduce(
      (accumulator: any, curValue: any) => {
        return accumulator + curValue.size;
      },
      0
    );

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

  const handleNewFileUpload = (e: any) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFieldValue(name, updatedFiles);

      if (onUpload) {
        onUpload(updatedFiles);
      }
    }
  };

  const removeFile = (fileIndex: number) => {
    field.value.splice(fileIndex, 1);
    setFieldValue(name, field.value);
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea: any, image: string, fileName: string) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context?.drawImage(
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

      _setImage(dataURL, fileName).then((value) => {
        let updatedField = field.value.map((obj: File) =>
          obj.name === fileName ? value : obj
        );
        setFieldValue(name, updatedField);
        closeImageCropper();
      });
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {};

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
            <UploadFileBtn
              type="button"
              onClick={handleUploadBtnClick}
              disabled={otherProps.disabled}
              theme={theme}
            >
              <FileUploadIcon sx={{ fontSize: "20px" }} />
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
              {field.value?.map((file: File, index: any) => {
                const allowedTypes = [
                  "text/csv", // CSV file
                  "application/vnd.ms-excel", // Old Excel (.xls)
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // New Excel (.xlsx)
                ];
                let isPdfFile = file?.type === "application/pdf";
                let isExcelFile = allowedTypes.includes(file.type);
                let isImageFile = file?.type?.split("/")[0] === "image";
                let isVideoFile = file?.type?.split("/")[0] === "video";
                return (
                  <Grid container key={file.name} spacing={2} marginTop={0.2}>
                    <Grid item>
                      {URL.createObjectURL(file) && (
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          badgeContent={
                            <CancelIcon
                              color="primary"
                              onClick={() => removeFile(index)}
                            />
                          }
                          sx={{
                            cursor: "pointer",
                            color: "var(--primary-color)",
                            display: "flex",
                          }}
                        />
                      )}
                      <PreviewContainer>
                        <Box>
                          {isPdfFile && (
                            <ImagePreview
                              src="https://dsuabgmmtxmj1.cloudfront.net/common/pdf_file_icon.png"
                              alt={`file preview ${index}`}
                            />
                          )}
                          {isExcelFile && (
                            <ImagePreview
                              src="https://cdn.adeonatech.net/common/ms-excel.png"
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
                              poster={`file preview ${index}`}
                              autoPlay
                              muted
                            >
                              <source
                                src={URL.createObjectURL(file)}
                                type={file?.type}
                              ></source>
                            </VideoPreview>
                          )}
                          <FileMetaData
                            $isPdfFile={isPdfFile}
                            $isImageFile={isImageFile}
                            $isVideoFile={isVideoFile}
                            $isExcelFile={isExcelFile}
                          >
                            <Typography
                              width={100}
                              color="white"
                              variant="subtitle2"
                              style={{
                                wordWrap: "break-word",
                                fontWeight: "bold",
                              }}
                            >
                              {file.name.substring(0, 30) +
                                (file.name.length > 30 ? "..." : "")}
                            </Typography>
                            <aside>
                              <Typography
                                width={100}
                                color="white"
                                variant="subtitle2"
                              >
                                {convertBytesToKB(file.size)} kb
                              </Typography>
                              <aside>
                                {/*<RemoveFileIcon*/}
                                {/*    color='secondary'*/}
                                {/*    size='small'*/}
                                {/*    onClick={() => removeFile(fileName)}*/}
                                {/*><DeleteIcon/></RemoveFileIcon>*/}
                                <RemoveFileIcon
                                  color="inherit"
                                  size="small"
                                  onClick={() => {
                                    openFileViewer(file);
                                  }}
                                >
                                  <VisibilityIcon />
                                </RemoveFileIcon>
                                {isImageFile && (
                                  <RemoveFileIcon
                                    color="secondary"
                                    size="small"
                                    onClick={() => {
                                      openImageCropper(
                                        URL.createObjectURL(file),
                                        file.name,
                                        onCropDone,
                                        onCropCancel
                                      );
                                    }}
                                  >
                                    <CropIcon />
                                  </RemoveFileIcon>
                                )}
                              </aside>
                            </aside>
                          </FileMetaData>
                        </Box>
                      </PreviewContainer>
                    </Grid>
                    <Grid
                      item
                      xs={9.5}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid container>
                        <Typography
                          variant="subtitle2"
                          color={theme.palette.primary.dark}
                        >
                          {file.name.substring(0, 30) +
                            (file.name.length > 30 ? "..." : "")}
                        </Typography>
                        <Box sx={{ width: "100%" }}>
                          {progress !== undefined && progress > 0 && (
                            <LinearProgressWithLabel value={progress} />
                          )}
                        </Box>
                        <Grid item xs={6}>
                          <Typography variant="h6" color="grey">
                            {convertBytesToKB(file.size)} kb of{" "}
                            {convertBytesToMB(maxFileSizeInBytes)} MB{" "}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="flex-end"
                        >
                          {isImageFile && (
                            <Typography
                              variant="h6"
                              color="primary"
                              sx={{ cursor: "pointer", marginX: 1 }}
                              onClick={() => {
                                openImageCropper(
                                  URL.createObjectURL(file),
                                  file.name,
                                  onCropDone,
                                  onCropCancel
                                );
                              }}
                            >
                              Crop
                            </Typography>
                          )}
                          {!isExcelFile && (
                            <Typography
                              variant="h6"
                              color="primary"
                              sx={{ cursor: "pointer", marginX: 1 }}
                              onClick={() => {
                                openFileViewer(file);
                              }}
                            >
                              View
                            </Typography>
                          )}
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
          {meta?.error ? (
            <Typography variant="caption" color="error">
              {meta.error}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
      <ImageCropper />
    </>
  );
};
export default FileUpload;
