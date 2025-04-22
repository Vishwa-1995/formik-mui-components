import React from "react";
import { TextFieldProps } from "@mui/material";
type TextFieldWrapperProps = TextFieldProps & {
    name: string;
};
declare const TextFieldWrapper: React.FC<TextFieldWrapperProps>;
export default TextFieldWrapper;
