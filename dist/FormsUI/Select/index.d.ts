import React from "react";
import { TextFieldProps } from "@mui/material";
interface Option {
    value: string | number;
    label: string;
    image?: string;
    color?: string;
}
type SelectWrapperProps = TextFieldProps & {
    name: string;
    options: Option[];
    customHandleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    withImage?: boolean;
    loading?: boolean;
};
declare const SelectWrapper: React.FC<SelectWrapperProps>;
export default SelectWrapper;
//# sourceMappingURL=index.d.ts.map