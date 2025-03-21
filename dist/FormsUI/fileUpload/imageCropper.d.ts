import React from "react";
export declare const openImageCropper: (image: string, fileName: string, onCropDone: (x: any, y: string, z: string) => void, onCropCancel: () => void) => void;
export declare const closeImageCropper: () => void;
declare const ImageCropper: React.FC;
export default ImageCropper;
