import { useEffect, useRef, useState } from "react";
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
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useTheme } from "@mui/material/styles";
import { JSX } from "react/jsx-runtime";
import { openFileViewer } from "./FileViewer";

interface FileUploadProps {
  label: string;
  name: string;
  maxFileSizeInBytes?: number;
  progress?: {
    progress: number;
    files: File[];
  };
  onUpload?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  multiple?: boolean;
  disabled?: boolean;
  accept?: string;
  isCropperEnabled?: boolean;
  // Add any other props you need
}

// helper: check if file matches accept string
function isAcceptedFileType(file: File, accept?: string): boolean {
  if (!accept) return true;

  const accepts = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const fileName = (file.name || "").toLowerCase();
  const fileType = (file.type || "").toLowerCase();

  for (const a of accepts) {
    if (a.startsWith(".")) {
      // extension-based, e.g. ".png"
      if (fileName.endsWith(a)) return true;
    } else if (a.endsWith("/*")) {
      // wildcard mime, e.g. "image/*"
      const [acceptedMain] = a.split("/");
      const [fileMain] = fileType.split("/");
      if (acceptedMain && fileMain && acceptedMain === fileMain) return true;
    } else {
      // exact mime match, e.g. "image/png"
      if (fileType === a) return true;
    }
  }

  return false;
}

// improved validateFile using the helper
const validateFile = (
  file: File,
  maxFileSizeInBytes: number,
  accept?: string
) => {
  const errors: string[] = [];

  // file size
  if (file.size > maxFileSizeInBytes) {
    errors.push(
      `File "${file.name}" exceeds max size of ${convertBytesToMB(
        maxFileSizeInBytes
      )} MB`
    );
  }

  // file type using robust check
  if (!isAcceptedFileType(file, accept)) {
    errors.push(`File "${file.name}" is not an accepted type (${accept})`);
  }

  return errors;
};

export const _setImage = async (
  src: string,
  filename: string
): Promise<File | object> => {
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
  onRemove,
  isCropperEnabled = true,
  ...otherProps
}: FileUploadProps) => {
  const theme = useTheme();
  const fileInputField: any = useRef(null);
  const { setFieldValue, setFieldError } = useFormikContext();
  const [field, meta] = useField(name);
  const [fileErrors, setFileErrors] = useState<
    { file: File; errors: string[] }[]
  >([]);

  const handleUploadBtnClick = () => {
    fileInputField?.current.click();
  };

  const addNewFiles = (newFiles: FileList | File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: { file: File; errors: string[] }[] = [];

    for (const file of Array.from(newFiles as any) as File[]) {
      const errors = validateFile(file, maxFileSizeInBytes, otherProps.accept);
      if (errors.length === 0) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, errors });
      }
    }

    // ✅ Set Formik error if any invalid files exist
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles
        .map((e) => e.errors.join(", "))
        .join("; ");
      setFieldError(name, errorMessages);
    } else {
      setFieldError(name, undefined);
    }

    setFileErrors((prev) => [...prev, ...invalidFiles]);

    // ✅ Only valid files should update the field value
    const updatedFiles = otherProps.multiple
      ? [...(field.value || []), ...validFiles]
      : validFiles;

    return updatedFiles;
  };

  useEffect(() => {
    if (field.value && typeof field.value.name == "string") {
      const updatedFiles = addNewFiles([field.value]);
      setFieldValue(name, updatedFiles);
    }
  }, [field.value]);

  const handleNewFileUpload = (e: any) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      const updatedFiles = addNewFiles(newFiles);
      if (onUpload) {
        onUpload(updatedFiles);
      }
      setFieldValue(name, updatedFiles);
    }
  };

  const removeFile = async (fileIndex: number) => {
    try {
      if (onRemove) await onRemove(fileIndex);

      const removedFile = field.value[fileIndex];

      // Remove from local error list
      const updatedErrors = fileErrors.filter(
        (err) => err.file.name !== removedFile.name
      );
      setFileErrors(updatedErrors);

      // Remove from Formik value
      const updatedFiles = field.value.filter(
        (_: any, i: number) => i !== fileIndex
      );
      setFieldValue(name, updatedFiles);

      // ✅ Update Formik error text if no invalid files remain
      if (updatedErrors.length === 0) {
        setFieldError(name, undefined);
      } else {
        const errorMessages = updatedErrors
          .map((e) => e.errors.join(", "))
          .join("; ");
        setFieldError(name, errorMessages);
      }
    } catch (err) {
      console.log("❌ Deletion canceled or failed", err);
    }
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea: any, image: string, fileName: string) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    const imageObj1 = new Image();
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
        const updatedField = field.value.map((obj: File) =>
          obj.name === fileName ? value : obj
        );
        if (
          onUpload &&
          updatedField instanceof Array &&
          updatedField.every((item) => item instanceof File)
        ) {
          onUpload(updatedField);
        }
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
                const isPdfFile = file?.type === "application/pdf";
                const isExcelFile = allowedTypes.includes(file.type);
                const isImageFile = file?.type?.split("/")[0] === "image";
                const isVideoFile = file?.type?.split("/")[0] === "video";
                const currentFileError = fileErrors.find(
                  (err) => err.file.name === file.name
                );
                return (
                  <Grid
                    container
                    key={file.name}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      borderBottom: "1px solid #eee",
                      py: 1,
                      px: 1,
                      gap: 1,
                      flexWrap: "nowrap",
                    }}
                  >
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
                      xs={9}
                      md={12}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="subtitle2"
                          color={theme.palette.primary.dark}
                          noWrap
                          sx={{
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Box sx={{ width: "100%" }}>
                          {progress?.progress !== undefined &&
                            progress.progress > 0 &&
                            progress.progress < 100 &&
                            progress.files.includes(file) && (
                              <LinearProgressWithLabel
                                value={progress.progress}
                              />
                            )}
                          {progress?.progress !== undefined &&
                            progress.progress === 100 &&
                            progress.files.includes(file) && (
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                              >
                                <DoneAllIcon color="success" fontSize="small" />
                                <Typography
                                  variant="body2"
                                  color={theme.palette.success.main}
                                  fontSize="small"
                                >
                                  Uploaded
                                </Typography>
                              </Box>
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
                          {isImageFile && isCropperEnabled && (
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
                    {currentFileError && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5 }}
                      >
                        {currentFileError.errors.join(", ")}
                      </Typography>
                    )}
                  </Grid>
                );
              })}
            </PreviewList>
          </FilePreviewContainer>
        </Grid>
        <Grid item xs={12}>
          {meta?.error && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {meta.error}
            </Typography>
          )}
        </Grid>
      </Grid>
      <ImageCropper />
    </>
  );
};
export default FileUpload;
