import React from "react";
interface ItemImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    maxFileSizeInBytes?: number;
    onUpload?: (files: File) => void;
    onRemove?: () => void;
    isCropperEnabled?: boolean;
    required?: boolean;
    isLoading?: boolean;
}
declare const ItemImageUpload: React.FC<ItemImageUploadProps>;
export default ItemImageUpload;
//# sourceMappingURL=item-image-upload.component.d.ts.map