import React from "react";
import { TextFieldProps } from "@mui/material";
interface Option {
    value: string | number;
    label: string;
}
type SelectWrapperProps = TextFieldProps & {
    name: string;
    options: Option[];
    customHandleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
declare const SelectWrapper: React.FC<SelectWrapperProps>;
export default SelectWrapper;
