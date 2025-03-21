import React from "react";
import { AutocompleteProps } from "@mui/material";
type AutoCompleteWrapperProps = {
    freeSolo: boolean;
    disabled: boolean;
    name: string;
    getOptions: (query: string) => Promise<any>;
    label: string;
    customHandleChange?: () => void;
} & Partial<AutocompleteProps<any, any, any, any>>;
declare const AutoCompleteWrapper: React.FC<AutoCompleteWrapperProps>;
export default AutoCompleteWrapper;
