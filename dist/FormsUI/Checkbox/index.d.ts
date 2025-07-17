import React from "react";
import { SxProps, Theme } from "@mui/material/styles";
interface CheckboxWrapperProps {
    name: string;
    legend?: React.ReactNode;
    label: React.ReactNode;
    labelStyle?: SxProps<Theme>;
    customHandleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}
declare const CheckboxWrapper: React.FC<CheckboxWrapperProps>;
export default CheckboxWrapper;
