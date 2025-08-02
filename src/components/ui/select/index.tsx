import { cn } from "@/lib/utils";
import {
    Select as SelectRoot,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./primitives"



type SelectProps = {
    value?: string,
    onChange?: (value: string) => void,
    options: {
        value: string,
        label: string
    }[];
    placeholder?: string
    className?: string
}

export const Select = ({ value, onChange, options, placeholder, className }: SelectProps) => {
    return (
        <SelectRoot value={value} onValueChange={onChange} >
            <SelectTrigger className={cn("w-full", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}