import React from "react";
import { TimePickerProps } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
interface TimePickerWrapperProps extends Omit<TimePickerProps<Dayjs>, "value" | "onChange"> {
    name: string;
}
declare const TimePickerWrapper: React.FC<TimePickerWrapperProps>;
export default TimePickerWrapper;
