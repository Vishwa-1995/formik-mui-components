interface DateTimePickerWrapperProps {
    required?: boolean;
    version?: "desktop" | "mobile" | "responsive";
    name: string;
    [key: string]: any;
}
declare const DateTimePickerWrapper: React.FC<DateTimePickerWrapperProps>;
export default DateTimePickerWrapper;
