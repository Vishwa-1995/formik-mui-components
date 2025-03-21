import React from "react";
import { AutocompleteProps } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
type Option = {
    value: string | number;
    label: string;
};
type AutoCompleteSearchMultipleWrapperProps = {
    name: string;
    label: string;
    useQueryResult: UseQueryResult<Option[], Error>;
    setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
    disabled?: boolean;
} & Partial<AutocompleteProps<any, any, any, any>>;
declare const AutoCompleteSearchMultipleWrapper: React.FC<AutoCompleteSearchMultipleWrapperProps>;
export default AutoCompleteSearchMultipleWrapper;
