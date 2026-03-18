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
  ViewFileIcon,
  VideoPreview,
} from "./file-upload.styles";
import { useField, useFormikContext } from "formik";
import { Badge, Box, CircularProgress, Stack, Typography } from "@mui/material";
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
  required?: boolean;
  maxFilesCount?: number;
  accept?: string;
  isCropperEnabled?: boolean;
  isLoading?: boolean;
}

// Helper: Generate a unique identifier for a file
const getFileIdentifier = (file: File): string => {
  // Use name + size + lastModified as a unique identifier
  return `${file.name}-${file.size}-${file.lastModified}`;
};

// Helper: Check if file already exists in the array
const isDuplicateFile = (file: File, existingFiles: File[]): boolean => {
  const fileId = getFileIdentifier(file);
  return existingFiles.some(existingFile =>
    getFileIdentifier(existingFile) === fileId
  );
};

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
  accept?: string,
  existingFiles: File[] = []
) => {
  const errors: string[] = [];

  // Check for duplicates
  if (isDuplicateFile(file, existingFiles)) {
    errors.push(`File "${file.name}" is already uploaded`);
  }

  // file size
  if (file.size > maxFileSizeInBytes) {
    errors.push(
      `File "${file.name}" exceeds max size of ${formatFileSize(maxFileSizeInBytes)}`
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
export const DEFAULT_MAX_FILES_COUNT = 10;

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
  required,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  maxFilesCount = DEFAULT_MAX_FILES_COUNT,
  progress,
  onUpload,
  onRemove,
  isCropperEnabled = true,
  isLoading = false,
  ...otherProps
}: FileUploadProps) => {
  const theme = useTheme();
  const fileInputField: any = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setFieldValue, setFieldError, submitCount } = useFormikContext<any>();
  const [field, meta] = useField(name);
  const [fileErrors, setFileErrors] = useState<
    { file: File; errors: string[] }[]
  >([]);
  const [duplicateFiles, setDuplicateFiles] = useState<File[]>([]);
  const [largeFiles, setLargeFiles] = useState<File[]>([]);
  const [invalidTypeFiles, setInvalidTypeFiles] = useState<File[]>([]);

  const handleUploadBtnClick = () => {
    fileInputField?.current.click();
  };

  const currentTotalSize = (field.value || []).reduce(
    (acc: number, f: File) => acc + (f.size || 0),
    0
  );
  const remainingSize = Math.max(0, maxFileSizeInBytes - currentTotalSize);

  const addNewFiles = (newFiles: FileList | File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: { file: File; errors: string[] }[] = [];
    const duplicateFiles: File[] = [];
    let runningTotalSize = currentTotalSize;
    let runningTotalCount = (field.value || []).length;

    for (const file of Array.from(newFiles as any) as File[]) {
      if (otherProps.multiple && runningTotalCount >= maxFilesCount) {
        setFieldError(name, `Maximum ${maxFilesCount} files allowed`);
        break;
      }

      const remainingBytesForThisFile = maxFileSizeInBytes - runningTotalSize;
      const errors = validateFile(
        file,
        remainingBytesForThisFile,
        otherProps.accept,
        field.value || []
      );

      if (errors.length === 0) {
        validFiles.push(file);
        runningTotalSize += file.size;
        runningTotalCount += 1;
      } else {
        // Categorize errors for temporary warnings
        const isDuplicate = errors.some(e => e.includes("already uploaded"));
        const isTooLarge = errors.some(e => e.includes("exceeds max size"));
        const isInvalidType = errors.some(e => e.includes("not an accepted type"));

        if (isDuplicate) {
          duplicateFiles.push(file);
        } else if (isTooLarge) {
          largeFiles.push(file);
        } else if (isInvalidType) {
          invalidTypeFiles.push(file);
        } else {
          invalidFiles.push({ file, errors });
        }
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

    // Show temporary warnings
    if (duplicateFiles.length > 0) {
      setDuplicateFiles(duplicateFiles);
      setTimeout(() => setDuplicateFiles(prev => prev.filter(f => !duplicateFiles.includes(f))), 5000);
    }
    if (largeFiles.length > 0) {
      setLargeFiles(largeFiles);
      setTimeout(() => setLargeFiles(prev => prev.filter(f => !largeFiles.includes(f))), 5000);
    }
    if (invalidTypeFiles.length > 0) {
      setInvalidTypeFiles(invalidTypeFiles);
      setTimeout(() => setInvalidTypeFiles(prev => prev.filter(f => !invalidTypeFiles.includes(f))), 5000);
    }

    setFileErrors((prev) => [...prev, ...invalidFiles]);

    // ✅ Only valid files should update the field value
    const updatedFiles = otherProps.multiple
      ? [...(field.value || []), ...validFiles]
      : validFiles.length > 0 ? [validFiles[0]] : [];

    return updatedFiles;
  };

  useEffect(() => {
    if (field.value && typeof field.value.name == "string") {
      const updatedFiles = addNewFiles([field.value]);
      setFieldValue(name, updatedFiles);
    }
  }, [field.value]);

  useEffect(() => {
    if (submitCount > 0 && meta.error && containerRef.current) {
      containerRef.current.focus();
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitCount]);

  const handleNewFileUpload = (e: any) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      const updatedFiles = addNewFiles(newFiles);
      if (onUpload && updatedFiles.length > 0) {
        onUpload(updatedFiles);
      }
      setFieldValue(name, updatedFiles);

      // Reset file input to allow selecting same file again after removal
      if (fileInputField.current) {
        fileInputField.current.value = "";
      }
    }
  };

  const removeFile = async (fileIndex: number) => {
    try {
      if (onRemove) { await onRemove(fileIndex); return }

      const removedFile = field.value[fileIndex];

      // Remove from local error list
      const updatedErrors = fileErrors.filter(
        (err) => err.file.name !== removedFile.name
      );
      setFileErrors(updatedErrors);

      // Remove from duplicate files list
      setDuplicateFiles(prev => prev.filter(f => getFileIdentifier(f) !== getFileIdentifier(removedFile)));

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
  const onCropCancel = () => { };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {/* Label */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" color="textPrimary" sx={{ fontWeight: 600 }}>
            {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
          </Typography>
          {otherProps.multiple && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                Files: <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{(field.value || []).length}/{maxFilesCount}</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                Total: <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{formatFileSize(currentTotalSize)}</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                Remaining: <Box component="span" sx={{ color: remainingSize > 0 ? 'success.main' : 'error.main', fontWeight: 700 }}>{formatFileSize(remainingSize)}</Box>
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Upload Container */}
        <FileUploadContainer
          ref={containerRef}
          tabIndex={-1}
          style={{
            borderColor: (meta.touched && meta.error) ? theme.palette.error.main : undefined,
            borderStyle: (meta.touched && meta.error) ? 'solid' : 'dotted',
            outline: 'none',
            position: 'relative'
          }}
        >
          {isLoading ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: '100px',
              gap: 1.5
            }}>
              <CircularProgress size={32} thickness={4} color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', textAlign: 'center' }}>
                Fetching existing files...
              </Typography>
            </Box>
          ) : (
            <>
              <DragDropText>Drag and drop your files anywhere or</DragDropText>
              <UploadFileBtn
                type="button"
                onClick={handleUploadBtnClick}
                disabled={otherProps.disabled}
              >
                <FileUploadIcon />
                <span>Select {otherProps.multiple ? "files" : "a file"}</span>
              </UploadFileBtn>
            </>
          )}
          <FormField
            type="file"
            ref={fileInputField}
            onChange={handleNewFileUpload}
            title=""
            value=""
            {...otherProps}
            disabled={otherProps.disabled || isLoading}
          />
        </FileUploadContainer>

        {/* Warning Messages (Auto-hide after 5s) */}
        <Stack spacing={1} sx={{ mt: 1 }}>
          {duplicateFiles.length > 0 && (
            <Box sx={{ p: 1, backgroundColor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
              <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                ⚠️ <strong>Duplicate skipped:</strong> {duplicateFiles.map(f => f.name).join(', ')}
              </Typography>
            </Box>
          )}

          {largeFiles.length > 0 && (
            <Box sx={{ p: 1, backgroundColor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
              <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                🚫 <strong>Too large (Remaining {formatFileSize(remainingSize)}):</strong> {largeFiles.map(f => f.name).join(', ')}
              </Typography>
            </Box>
          )}

          {invalidTypeFiles.length > 0 && (
            <Box sx={{ p: 1, backgroundColor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
              <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                ℹ️ <strong>Invalid format:</strong> {invalidTypeFiles.map(f => f.name).join(', ')}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* File Preview List */}
        <FilePreviewContainer>
          <PreviewList>
            {field.value?.map((file: File, index: number) => {
              const allowedTypes = [
                "text/csv",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ];
              const isPdfFile = file?.type === "application/pdf";
              const isExcelFile = allowedTypes.includes(file.type);
              const isImageFile = file?.type?.split("/")[0] === "image";
              const isVideoFile = file?.type?.split("/")[0] === "video";
              const currentFileError = fileErrors.find(
                (err) => err.file.name === file.name
              );

              return (
                <Box
                  key={`${getFileIdentifier(file)}-${index}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  {/* Thumbnail */}
                  <Badge
                    overlap="rectangular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    badgeContent={
                      <Box
                        onClick={() => removeFile(index)}
                        sx={{
                          backgroundColor: '#ef4444',
                          border: '2px solid white',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 10,
                          '&:hover': { transform: 'scale(1.1)' }
                        }}
                      >
                        <CancelIcon sx={{ color: 'white', fontSize: 13 }} />
                      </Box>
                    }
                  >
                    <PreviewContainer>
                      <Box>
                        {isPdfFile && (
                          <ImagePreview
                            style={{ objectFit: 'contain' }}
                            src="https://dsuabgmmtxmj1.cloudfront.net/common/pdf_file_icon.png"
                            alt={`file preview ${index}`}
                          />
                        )}
                        {isExcelFile && (
                          <ImagePreview
                            style={{ objectFit: 'contain' }}
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
                          <VideoPreview poster={`file preview ${index}`} autoPlay muted>
                            <source src={URL.createObjectURL(file)} type={file?.type} />
                          </VideoPreview>
                        )}
                        <FileMetaData
                          $isPdfFile={isPdfFile}
                          $isImageFile={isImageFile}
                          $isVideoFile={isVideoFile}
                          $isExcelFile={isExcelFile}
                        >
                          <Typography variant="caption" color="white" sx={{ fontWeight: 'bold' }}>
                            {file.name.substring(0, 15) + (file.name.length > 15 ? "..." : "")}
                          </Typography>
                        </FileMetaData>
                      </Box>
                    </PreviewContainer>
                  </Badge>

                  {/* File Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ fontWeight: 700, color: '#1a202c', fontSize: '14px', mb: 0.2 }}
                    >
                      {file.name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500 }}>
                      {formatFileSize(file.size)}

                      {/* Add the resolution component here */}
                      {isImageFile && <ImageResolution file={file} />}
                    </Typography>

                    {/* Progress Bar */}
                    {progress?.progress !== undefined &&
                      progress.progress > 0 &&
                      progress.progress < 100 &&
                      progress.files.includes(file) && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgressWithLabel value={progress.progress} />
                        </Box>
                      )}

                    {/* Upload Complete */}
                    {progress?.progress === 100 && progress.files.includes(file) && (
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                        <DoneAllIcon color="success" fontSize="small" />
                        <Typography variant="caption" color="success.main">
                          Uploaded
                        </Typography>
                      </Box>
                    )}

                    {/* Error Message */}
                    {currentFileError && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {currentFileError.errors.join(", ")}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    {isImageFile && isCropperEnabled && (
                      <RemoveFileIcon
                        size="small"
                        color="primary"
                        onClick={() => {
                          openImageCropper(
                            URL.createObjectURL(file),
                            file.name,
                            onCropDone,
                            onCropCancel
                          );
                        }}
                        title="Crop"
                      >
                        <CropIcon fontSize="small" />
                      </RemoveFileIcon>
                    )}

                    {!isExcelFile && (
                      <ViewFileIcon
                        size="small"
                        onClick={() => openFileViewer(file)}
                        title="View"
                      >
                        <VisibilityIcon fontSize="medium" />
                      </ViewFileIcon>
                    )}
                  </Box>
                </Box>
              );
            })}
          </PreviewList>
        </FilePreviewContainer>

        {/* Formik Error */}
        {meta?.touched && meta?.error && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {meta.error}
          </Typography>
        )}
      </Box>

      <ImageCropper />
    </>
  );
};
export default FileUpload;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const isMB = bytes >= 1024 * 1024;

  if (isMB) {
    // Show MB with up to 3 decimal places
    const mb = bytes / (1024 * 1024);
    return `${parseFloat(mb.toFixed(3))} MB`;
  } else {
    // Show KB rounded
    const kb = bytes / 1024;
    return `${Math.round(kb)} KB`;
  }
};

const ImageResolution = ({ file }: { file: File }) => {
  const [resolution, setResolution] = useState<string>("");

  useEffect(() => {
    if (file?.type?.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setResolution(`${img.naturalWidth} x ${img.naturalHeight}`);
        URL.revokeObjectURL(img.src); // Clean up memory
      };
    }
  }, [file]);

  if (!resolution) return null;

  return (
    <Typography variant="caption" sx={{ color: "primary.main", fontWeight: "bold", ml: 1 }}>
      • {resolution}
    </Typography>
  );
};