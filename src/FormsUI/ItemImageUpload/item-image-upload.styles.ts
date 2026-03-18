import { styled } from "@mui/material/styles";
import { IconButton, Box, Button, Typography } from "@mui/material";

export const UploadContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const ImageOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(5px)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10%', // Use percentage for more responsive gaps
  opacity: 0,
  visibility: 'hidden',
  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 2,
}));

export const ImagePreviewWrapper = styled(Box)(() => ({
  position: 'relative',
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  padding: '6px',
  border: '2px dashed #e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    [`& .${ImageOverlay.name || 'image-overlay'}`]: {
      opacity: 1,
      visibility: 'visible',
    },
  },
  '@media (max-width: 600px)': {
    width: '120px',
    height: '120px',
  },
}));

export const FormField = styled('input')(() => ({
  display: 'none',
}));

export const ActionIcon = styled(IconButton)(() => ({
  color: '#ffffff !important',
  background: 'rgba(255, 255, 255, 0.12) !important',
  backdropFilter: 'blur(10px)',
  padding: '12% !important', // Padding as % of container width
  border: '1px solid rgba(255, 255, 255, 0.2) !important',
  transition: 'all 0.2s ease !important',
  width: 'clamp(32px, 20%, 38px)',
  height: 'clamp(32px, 20%, 38px)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2) !important',
    transform: 'scale(1.15)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  },
}));

export const RemoveIcon = styled(ActionIcon)(() => ({
  '&:hover': {
    background: 'rgba(239, 68, 68, 0.85) !important',
    borderColor: 'rgba(239, 68, 68, 0.45) !important',
  },
}));

export const StyledUploadButton = styled(Button)(() => ({
  borderRadius: '12px !important',
  padding: '10px 24px !important',
  textTransform: 'none !important',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1) !important',
  transition: 'all 0.3s ease !important',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15) !important',
  },
}));

export const InfoText = styled(Typography)(() => ({
  color: '#718096 !important',
  fontSize: '0.75rem !important',
  marginBottom: '20px !important',
  textAlign: 'center',
}));
