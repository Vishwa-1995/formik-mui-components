import React, { useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useField, useFormikContext } from "formik";
import { Avatar, Badge, Box, Button, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FormField } from "./item-image-upload.styles";

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 2097152;

interface ItemImageUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  maxFileSizeInBytes?: number;
}

const ItemImageUpload: React.FC<ItemImageUploadProps> = ({
  label,
  name,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const theme: any = useTheme();
  const fileInputField = useRef<HTMLInputElement>(null);
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField<File | null>(name);
  const [url, setUrl] = useState<string | null>(null);

  const handleUploadBtnClick = () => {
    fileInputField.current?.click();
  };

  const handleNewFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles && newFiles.length) {
      const file = newFiles[0];
      if (file.size <= maxFileSizeInBytes) {
        setFieldValue(name, file);
        setUrl(URL.createObjectURL(file));
      }
    }
  };

  const removeFile = () => {
    setFieldValue(name, null);
    setUrl(null);
  };

  useEffect(() => {
    if (field.value && typeof field.value.name === "string") {
      setUrl(URL.createObjectURL(field.value));
    }
  }, [field.value]);

  return (
    <div className="row mb-4">
      <div className="col-md-12">
        <Typography variant="body1" color="textSecondary" textAlign="center">
          {label}
        </Typography>
        <Box
          sx={{
            mt: 2,
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {url && (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              badgeContent={<CancelIcon onClick={removeFile} />}
              sx={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                mb: -2,
                width: 135,
              }}
            />
          )}
          <Avatar
            src={url ?? undefined}
            sx={{
              height: 130,
              mb: 2,
              width: 130,
              border: `5px solid ${theme.palette.primary[200]}`,
              color: theme.palette.primary[200],
            }}
          />
          <Typography color="secondary" variant="caption" textAlign="center">
            Select an image file on your computer (2MB max)
          </Typography>
        </Box>
        <Divider
          sx={{
            m: 2,
            borderBottomWidth: 1,
            borderBottomColor: theme.palette.primary.main,
          }}
        />
        <Button
          color="primary"
          fullWidth
          variant="outlined"
          type="button"
          onClick={handleUploadBtnClick}
          disabled={otherProps.disabled}
          startIcon={<CloudUploadIcon />}
        >
          Upload picture
        </Button>
        <FormField
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}
        />
      </div>
      <div className="col-md-12">
        {meta && meta.error ? (
          <Typography variant="caption" color="error">
            {meta.error}
          </Typography>
        ) : null}
      </div>
    </div>
  );
};

export default ItemImageUpload;
