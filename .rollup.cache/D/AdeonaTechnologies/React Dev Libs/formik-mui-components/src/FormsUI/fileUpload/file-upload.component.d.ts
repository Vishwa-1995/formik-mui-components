export function convertBytesToKB(bytes: any): number;
export function convertBytesToMB(bytes: any): number;
export default FileUpload;
declare function FileUpload({ label, name, maxFileSizeInBytes, progress, ...otherProps }: {
    [x: string]: any;
    label: any;
    name: any;
    maxFileSizeInBytes?: any;
    progress: any;
}): import("react/jsx-runtime").JSX.Element;
