import React from "react";
import { UseQueryResult } from "@tanstack/react-query";
export default function AutoCompleteSearchWrapper<Option extends {
    value: string | number;
    label: string;
}>(props: Readonly<{
    name: string;
    label: string;
    useQueryResult: UseQueryResult<Option[], Error>;
    setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
    disabled?: boolean;
}>): import("react/jsx-runtime").JSX.Element;
