import React from "react";
import { AutocompleteProps } from "@mui/material";
type AutoCompleteWrapperProps = {
    required?: boolean;
    freeSolo: boolean;
    disabled: boolean;
    name: string;
    getOptions: (query: string) => Promise<any>;
    label: string;
    customHandleChange?: (data: any) => void;
} & Partial<AutocompleteProps<any, any, any, any>>;
declare const AutoCompleteWrapper: React.FC<AutoCompleteWrapperProps>;
export default AutoCompleteWrapper;
