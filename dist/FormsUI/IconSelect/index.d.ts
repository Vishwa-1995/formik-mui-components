import React from "react";
import { TextFieldProps } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
interface Option {
    value: string | number;
    icon: SvgIconComponent;
    name: string;
    color?: string;
}
type IconSelectWrapperProps = TextFieldProps & {
    name: string;
    options: Option[];
    loading?: boolean;
};
declare const IconSelectWrapper: React.FC<IconSelectWrapperProps>;
export default IconSelectWrapper;
//# sourceMappingURL=index.d.ts.map