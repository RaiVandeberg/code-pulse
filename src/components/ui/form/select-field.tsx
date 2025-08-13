import { Form } from "react-hook-form"

import { ComponentProps } from "react"
import { Input } from "../input"
import { FormField } from "./field"
import { InputMask } from "@react-input/mask"
import { Select } from "../select"

type SelectFieldProps = ComponentProps<typeof FormField> &
    Omit<ComponentProps<typeof Select>, "onChange">

export const SelectField = ({ name, className, ...props }: SelectFieldProps) => {
    return (
        <FormField name={name} className={className} {...props}>
            {({ field }) => <Select {...field} {...props} />}
        </FormField>
    )
}