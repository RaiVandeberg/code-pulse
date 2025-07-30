import { Form } from "react-hook-form"

import { ComponentProps } from "react"
import { Input } from "../input"
import { FormField } from "./field"

type InputFieldProps = ComponentProps<typeof FormField> & ComponentProps<typeof Input>

export const InputField = ({ name, className, ...props }: InputFieldProps) => {
    return (
        <FormField name={name} className={className} {...props}>
            {({ field }) => (
                <Input
                    {...field} {...props}

                />
            )}
        </FormField>
    )
}