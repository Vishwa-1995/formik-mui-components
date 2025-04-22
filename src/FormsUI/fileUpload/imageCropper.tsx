import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { create } from "zustand";
import {
  Box,
  Button,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

type ImageCropperStore = {
  image: string;
  fileName: string;
  onCropDone: (x: any, y: string, z: string) => void;
  onCropCancel: () => void;
  close: boolean;
};

const useImageCropperStore = create<ImageCropperStore>((set) => ({
  image: "",
  fileName: "",
  onCropDone: (x) => {},
  onCropCancel: () => {},
  close: false,
}));

export const openImageCropper = (
  image: string,
  fileName: string,
  onCropDone: (x: any, y: string, z: string) => void,
  onCropCancel: () => void
) => {
  useImageCropperStore.setState({
    image: image,
    fileName: fileName,
    onCropDone: onCropDone,
    onCropCancel: onCropCancel,
    close: true,
  });
};

export const closeImageCropper = () => {
  useImageCropperStore.setState({
    close: false,
  });
};

const ImageCropper: React.FC = () => {
  const { image, fileName, onCropDone, onCropCancel, close } =
    useImageCropperStore();

  const handleClose = () => {
    useImageCropperStore.setState({
      close: false,
    });
    onCropCancel();
  };

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = (event: any) => {
    setAspectRatio(event.target.value);
  };

  return (
    <Dialog
      fullScreen
      open={close}
      onClose={handleClose}
      fullWidth={true}
      slotProps={{
        paper: {
          style: { borderRadius: 15 },
        },
      }}
    >
      <DialogContent style={{ textAlign: "center" }}>
        <Box>
          <Cropper
            image={image}
            aspect={aspectRatio}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                width: "100%",
                height: "75%",
                backgroundColor: "#fff",
              },
            }}
          />
        </Box>
      </DialogContent>
      <FormControl>
        <RadioGroup
          row
          name="row-radio-buttons-group"
          defaultValue={1}
          onChange={onAspectRatioChange}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <FormControlLabel value={1} control={<Radio />} label="1:1" />
          <FormControlLabel value={5 / 4} control={<Radio />} label="5:4" />
          <FormControlLabel value={4 / 3} control={<Radio />} label="4:3" />
          <FormControlLabel value={3 / 2} control={<Radio />} label="3:2" />
          <FormControlLabel value={5 / 3} control={<Radio />} label="5:3" />
          <FormControlLabel value={16 / 9} control={<Radio />} label="16:9" />
          <FormControlLabel value={3 / 1} control={<Radio />} label="3:1" />
        </RadioGroup>
      </FormControl>
      <DialogActions style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Box style={{ width: 10 }} />
        <Button
          onClick={() => {
            onCropDone(croppedArea, image, fileName);
          }}
          variant="contained"
          style={{ fontWeight: "bold" }}
          color="primary"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
