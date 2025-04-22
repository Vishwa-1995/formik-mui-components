import { JSX } from "react/jsx-runtime";
export declare const _setImage: (src: string, filename: string) => Promise<File | {}>;
export declare const convertBytesToKB: (bytes: number) => number;
export declare const convertBytesToMB: (bytes: number) => number;
declare const FileUpload: ({ label, name, maxFileSizeInBytes, progress, ...otherProps }: any) => JSX.Element;
export default FileUpload;
