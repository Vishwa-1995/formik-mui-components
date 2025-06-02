import React from "react";
interface ItemImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    maxFileSizeInBytes?: number;
    onUpload?: (files: File) => void;
}
declare const ItemImageUpload: React.FC<ItemImageUploadProps>;
export default ItemImageUpload;
