import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Cropper from "react-easy-crop";
import { create } from "zustand";
import { Box, Button, DialogContent, FormControl, FormControlLabel, Radio, RadioGroup, } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
const useImageCropperStore = create((set) => ({
    image: "",
    fileName: "",
    onCropDone: (x) => { },
    onCropCancel: () => { },
    close: false,
}));
export const openImageCropper = (image, fileName, onCropDone, onCropCancel) => {
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
const ImageCropper = () => {
    const { image, fileName, onCropDone, onCropCancel, close } = useImageCropperStore();
    const handleClose = () => {
        useImageCropperStore.setState({
            close: false,
        });
        onCropCancel();
    };
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(1 / 1);
    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };
    const onAspectRatioChange = (event) => {
        setAspectRatio(event.target.value);
    };
    return (_jsxs(Dialog, { fullScreen: true, open: close, onClose: handleClose, fullWidth: true, PaperProps: {
            style: { borderRadius: 15 },
        }, children: [_jsx(DialogContent, { style: { textAlign: "center" }, children: _jsx(Box, { children: _jsx(Cropper, { image: image, aspect: aspectRatio, crop: crop, zoom: zoom, onCropChange: setCrop, onZoomChange: setZoom, onCropComplete: onCropComplete, style: {
                            containerStyle: {
                                width: "100%",
                                height: "75%",
                                backgroundColor: "#fff",
                            },
                        } }) }) }), _jsx(FormControl, { children: _jsxs(RadioGroup, { row: true, name: "row-radio-buttons-group", defaultValue: 1 / 1, onChange: onAspectRatioChange, style: { display: "flex", justifyContent: "center" }, children: [_jsx(FormControlLabel, { value: 1 / 1, control: _jsx(Radio, {}), label: "1:1" }), _jsx(FormControlLabel, { value: 5 / 4, control: _jsx(Radio, {}), label: "5:4" }), _jsx(FormControlLabel, { value: 4 / 3, control: _jsx(Radio, {}), label: "4:3" }), _jsx(FormControlLabel, { value: 3 / 2, control: _jsx(Radio, {}), label: "3:2" }), _jsx(FormControlLabel, { value: 5 / 3, control: _jsx(Radio, {}), label: "5:3" }), _jsx(FormControlLabel, { value: 16 / 9, control: _jsx(Radio, {}), label: "16:9" }), _jsx(FormControlLabel, { value: 3 / 1, control: _jsx(Radio, {}), label: "3:1" })] }) }), _jsxs(DialogActions, { style: { display: "flex", justifyContent: "center" }, children: [_jsx(Button, { onClick: handleClose, variant: "outlined", children: "Cancel" }), _jsx(Box, { style: { width: 10 } }), _jsx(Button, { onClick: () => {
                            onCropDone(croppedArea, image, fileName);
                        }, variant: "contained", style: { fontWeight: "bold" }, color: "primary", children: "Done" })] })] }));
};
export default ImageCropper;
//# sourceMappingURL=imageCropper.js.map