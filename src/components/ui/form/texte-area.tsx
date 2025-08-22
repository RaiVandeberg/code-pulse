import { Form } from "react-hook-form"

import { ComponentProps } from "react"
import { Input } from "../input"
import { FormField } from "./field"
import { InputMask } from "@react-input/mask"
import { Select } from "../select"
import { Textarea } from "../textarea"

type TextareaFieldProps = ComponentProps<typeof FormField> &
    ComponentProps<typeof Textarea>

export const TextareaField = ({ name, className, ...props }: TextareaFieldProps) => {
    return (
        <FormField name={name} className={className} {...props}>
            {({ field }) => <Textarea {...field} {...props} />}
        </FormField>
    )
}