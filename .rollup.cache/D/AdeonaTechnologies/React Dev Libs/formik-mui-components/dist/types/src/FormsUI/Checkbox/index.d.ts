import React from "react";
interface CheckboxWrapperProps {
    name: string;
    legend: React.ReactNode;
    customHandleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
}
declare const CheckboxWrapper: React.FC<CheckboxWrapperProps>;
export default CheckboxWrapper;
