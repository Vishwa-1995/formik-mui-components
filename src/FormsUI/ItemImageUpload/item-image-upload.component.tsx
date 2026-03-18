import React, { useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CropIcon from "@mui/icons-material/Crop";
import { useField, useFormikContext } from "formik";
import { Avatar, Box, Typography, Tooltip, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FormField,
  ActionIcon,
  UploadContainer,
  ImagePreviewWrapper,
  ImageOverlay,
  RemoveIcon,
  StyledUploadButton,
  InfoText
} from "./item-image-upload.styles";
import ImageCropper, {
  closeImageCropper,
  openImageCropper,
} from "../fileUploadNew/imageCropper";
import FileViewer, { openFileViewer } from "../fileUploadNew/FileViewer";
import { _setImage } from "../fileUploadNew/file-upload.component";

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 2097152;

interface ItemImageUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  maxFileSizeInBytes?: number;
  onUpload?: (files: File) => void;
  onRemove?: () => void;
  isCropperEnabled?: boolean;
  required?: boolean;
  isLoading?: boolean;
}

const ItemImageUpload: React.FC<ItemImageUploadProps> = ({
  label,
  name,
  required,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  onUpload,
  onRemove,
  isCropperEnabled = true,
  isLoading = false,
  ...otherProps
}) => {
  const theme: any = useTheme();
  const fileInputField = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setFieldValue, submitCount } = useFormikContext<any>();
  const [field, meta] = useField<File | null>(name);
  const [url, setUrl] = useState<string | null>(null);

  const handleUploadBtnClick = () => {
    fileInputField.current?.click();
  };

  const handleNewFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles?.length) {
      const file = newFiles[0];
      if (file.size <= maxFileSizeInBytes) {
        setFieldValue(name, file);
        if (onUpload) {
          onUpload(file);
        }
      }
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove();
    setFieldValue(name, null);
    setUrl(null);
  };

  useEffect(() => {
    if (field.value && typeof field.value.name === "string") {
      const newUrl = URL.createObjectURL(field.value);
      setUrl(newUrl);
      return () => URL.revokeObjectURL(newUrl);
    } else {
      setUrl(null);
    }
  }, [field.value]);

  useEffect(() => {
    if (submitCount > 0 && meta.error && containerRef.current) {
      containerRef.current.focus();
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitCount]);

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

      _setImage(dataURL, fileName).then((value: any) => {
        setFieldValue(name, value);
        if (onUpload) {
          onUpload(value);
        }
        closeImageCropper();
      });
    };
  };

  const onCropCancel = () => { };

  return (
    <UploadContainer
      ref={containerRef}
      tabIndex={-1}
      sx={{ mb: 4, outline: 'none' }}
    >
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{
          fontWeight: 700,
          mb: 3,
          textAlign: "center"
        }}
      >
        {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
      </Typography>

      <ImagePreviewWrapper
        onClick={handleUploadBtnClick}
        sx={{
          borderColor: (meta.touched && meta.error) ? 'error.main' : '#e0e0e0',
          borderStyle: (meta.touched && meta.error) ? 'solid' : 'dashed',
          '&:hover': {
            borderColor: (meta.touched && meta.error) ? 'error.main' : 'primary.main',
          }
        }}
      >
        <Avatar
          src={url ?? undefined}
          sx={{
            width: "100%",
            height: "100%",
            border: `4px solid #fff`,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            bgcolor: "#f8f9fa",
            color: "#adb5bd"
          }}
        >
          {isLoading ? (
            <Box className="animate-spin">
              <CircularProgress size={40} color="primary" />
            </Box>
          ) : (
            !url && <CloudUploadIcon sx={{ fontSize: 40 }} />
          )}
        </Avatar>

        {url && (
          <ImageOverlay className="image-overlay">
            <Tooltip title="View Large">
              <ActionIcon
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileViewer(field.value);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </ActionIcon>
            </Tooltip>

            {isCropperEnabled && (
              <Tooltip title="Crop Image">
                <ActionIcon
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (field.value && url) {
                      openImageCropper(
                        url,
                        field.value.name,
                        onCropDone,
                        onCropCancel
                      );
                    }
                  }}
                >
                  <CropIcon fontSize="small" />
                </ActionIcon>
              </Tooltip>
            )}

            <Tooltip title="Remove">
              <RemoveIcon
                size="small"
                onClick={removeFile}
              >
                <CancelIcon fontSize="small" />
              </RemoveIcon>
            </Tooltip>
          </ImageOverlay>
        )}
      </ImagePreviewWrapper>

      <InfoText>
        Select a high-quality JPEG or PNG image.<br />
        Maximum file size: {maxFileSizeInBytes / (1024 * 1024)}MB.
      </InfoText>

      <StyledUploadButton
        variant="contained"
        color="primary"
        startIcon={isLoading ? <Box className="animate-spin"><CircularProgress size={20} color="primary" /></Box> : <CloudUploadIcon />}
        onClick={handleUploadBtnClick}
        disabled={!!otherProps.disabled || isLoading}
      >
        {isLoading ? "Loading..." : (url ? "Change Picture" : "Upload Picture")}
      </StyledUploadButton>

      <FormField
        type="file"
        ref={fileInputField}
        onChange={handleNewFileUpload}
        accept="image/*"
        {...otherProps}
      />

      {meta?.touched && meta?.error && (
        <Typography variant="caption" color="error" sx={{ mt: 1.5, fontWeight: 500 }}>
          {meta.error}
        </Typography>
      )}

      <ImageCropper />
      <FileViewer />
    </UploadContainer>
  );
};

export default ItemImageUpload;
