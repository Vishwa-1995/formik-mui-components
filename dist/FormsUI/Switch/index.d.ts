import React from "react";
import { SwitchProps } from "@mui/material/Switch";
interface SwitchWrapperProps extends Omit<SwitchProps, "name"> {
    name: string;
    label: string;
}
declare const SwitchWrapper: React.FC<SwitchWrapperProps>;
export default SwitchWrapper;
