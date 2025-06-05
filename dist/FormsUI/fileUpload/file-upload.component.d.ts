import { JSX } from "react/jsx-runtime";
interface FileUploadProps {
    label: string;
    name: string;
    maxFileSizeInBytes?: number;
    progress?: number;
    onUpload?: (file: File) => void;
    onRemove?: (index: number) => void;
    multiple?: boolean;
    disabled?: boolean;
    accept?: string;
}
export declare const _setImage: (src: string, filename: string) => Promise<File | object>;
export declare const convertBytesToKB: (bytes: number) => number;
export declare const convertBytesToMB: (bytes: number) => number;
declare const FileUpload: ({ label, name, maxFileSizeInBytes, progress, onUpload, onRemove, ...otherProps }: FileUploadProps) => JSX.Element;
export default FileUpload;
