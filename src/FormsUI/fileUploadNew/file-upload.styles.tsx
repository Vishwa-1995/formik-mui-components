import {
  Box,
  Typography,
  Button,
  styled,
  IconButton,
} from "@mui/material";

type FileMetaDataProps = {
  $isImageFile?: boolean;
  $isVideoFile?: boolean;
  $isPdfFile?: boolean;
  $isExcelFile?: boolean;
};

export const FileUploadContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: '5px 0 0',
  border: `2px dotted ${theme.palette.grey[300]}`,
  padding: '20px',
  borderRadius: '6px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'transparent',
  width: '100%',
  boxSizing: 'border-box',
}));

export const FormField = styled('input')({
  fontSize: '18px',
  display: 'block',
  width: '100%',
  border: 'none',
  textTransform: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0,
  cursor: 'pointer',
  
  '&:focus': {
    outline: 'none',
  },
});

export const DragDropText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '12px',
  color: theme.palette.grey[500],
  letterSpacing: '0.5px',
  margin: '0 0 16px 0',
  textAlign: 'center',
}));

export const UploadFileBtn = styled(Button)(({ theme }) => ({
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
  border: `2px solid ${theme.palette.primary.main}`,
  fontSize: '0.875rem',
  lineHeight: 1.5,
  padding: '10px 24px',
  textTransform: 'uppercase',
  fontWeight: 600,
  borderRadius: '8px',
  color: theme.palette.primary.main,
  position: 'relative',
  overflow: 'hidden',
  zIndex: 1,
  transition: 'all 250ms ease-in-out',
  gap: '8px',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    display: 'block',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: '100%',
    background: theme.palette.primary.main,
    zIndex: -1,
    transition: 'width 250ms ease-in-out',
  },
  
  '&:hover': {
    color: theme.palette.background.paper,
    backgroundColor: 'transparent',
    
    '&::after': {
      width: '110%',
    },
  },
  
  '&:disabled': {
    opacity: 0.4,
    filter: 'grayscale(100%)',
  },
  
  '@media (max-width: 500px)': {
    width: '100%',
    fontSize: '0.75rem',
    padding: '8px 16px',
  },
}));

export const FilePreviewContainer = styled(Box)({
  width: '100%',
  marginTop: '16px',
});

export const PreviewList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const RemoveFileIcon = styled(IconButton)`
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const PreviewContainer = styled(Box)({
  padding: '4px',
  width: '80px',
  height: '80px',
  borderRadius: '8px',
  boxSizing: 'border-box',
  flexShrink: 0,
  
  '& > div:first-of-type': {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
});

export const ImagePreview = styled('img')({
  borderRadius: '6px',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const VideoPreview = styled('video')({
  borderRadius: '6px',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const FileMetaData = styled(Box, {
  shouldForwardProp: (prop) => !['$isImageFile', '$isVideoFile', '$isPdfFile', '$isExcelFile'].includes(prop as string),
})<FileMetaDataProps>(({ $isImageFile, $isVideoFile, $isPdfFile, $isExcelFile }) => ({
  display: ($isImageFile || $isVideoFile || $isPdfFile || $isExcelFile) ? 'none' : 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: '10px',
  borderRadius: '6px',
  color: 'white',
  fontWeight: 'bold',
  backgroundColor: 'rgba(5, 5, 5, 0.55)',
  
  '& aside': {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));