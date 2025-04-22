import React from "react";
interface RadioOption {
    value: string | number;
    label: string;
    color?: string;
    labelColor?: string;
}
interface RadioGroupWrapperProps {
    name: string;
    label: string;
    disabled?: boolean;
    radioGroup: RadioOption[];
    [key: string]: any;
}
declare const RadioGroupWrapper: React.FC<RadioGroupWrapperProps>;
export default RadioGroupWrapper;
