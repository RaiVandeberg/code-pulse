import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form/field"
import { InputField } from "@/components/ui/form/input-fiel"
import { Form } from "@/components/ui/form/primitives"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select/index"
import { Separator } from "@/components/ui/separator"
import { creditCardCheckoutFormSchema } from "@/server/schemas/payment"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Cards from "react-credit-cards-2"


type FormData = z.infer<typeof creditCardCheckoutFormSchema>

type CreditCardFormProps = {
    onBack?: () => void;
}
export const CreditCardForm = ({ onBack }: CreditCardFormProps) => {
    const form = useForm<FormData>({
        resolver: zodResolver(creditCardCheckoutFormSchema),
        defaultValues: {
            installments: 1,
            cardNumber: "",
            cardValidThru: "",
            cardCvv: "",
            address: "",
            postalCode: "",
            addressNumber: "",
            phone: "",
            name: "",
            cpf: "",

        }
    })

    const { handleSubmit, watch } = form

    const formValues = watch()

    const onSubmit = (data: FormData) => {

    }

    const installmentsOptions = Array.from({ length: 12 }, (_, i) => ({
        label: `${i + 1}x`,
        value: `${i + 1}`,
    }))
    return (
        <Form {...form}>
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center gap-4 flex-col">
                    <div>
                        <div>
                            <Cards
                                cvc={formValues.cardCvv}
                                expiry={formValues.cardValidThru}
                                focused={undefined}
                                name={formValues.name}
                                number={formValues.cardNumber}
                                placeholders={{ name: "NOME COMPLETO" }}
                                locale={{ valid: "Valido até" }}
                            />
                        </div>
                    </div>
                    <div className="w-full grid sm:grid-cols-2 gap-2 flex-1">
                        <InputField name="name" placeholder="Nome Impresso no cartão" className="col-span-full" />
                        <InputField name="cpf" placeholder="CPF do titular" mask="___.___.___-__" />
                        <FormField name="phone">
                            {({ field }) => (
                                <Input
                                    {...field}
                                    onChange={({ target }) => {
                                        const value = target.value.replace(/\D/g, "")
                                        field.onChange(value)
                                    }}
                                    placeholder="Telefone do titular com DDD"
                                />
                            )}
                        </FormField>
                        <Separator className="col-span-full my-1 sm:my-2" />

                        <InputField name="cardNumber" placeholder="Número do cartão" mask="____ ____ ____ ____" />
                        <InputField name="cardValidThru" placeholder="Validade do cartão (MM/AA)" mask="__/__" />
                        <InputField name="cardCvv" placeholder="CVV" mask="___" />
                        <FormField name="installments">
                            {({ field }) => (
                                <Select
                                    value={String(field.value)}
                                    onChange={(value) => field.onChange(Number(value))}
                                    options={installmentsOptions}
                                    placeholder="Parcelas"

                                />
                            )}
                        </FormField>
                        <Separator className="col-span-full my-1 sm:my-2" />

                        <div className="col-span-full grid sm:grid-cols-[1.4fr_1fr_1fr] gap-2">
                            <InputField name="address" placeholder="Endereço (opcional)" />
                            <InputField name="addressNumber" placeholder="Número " />
                            <InputField name="postalCode" placeholder="CEP" mask="_____-___" />
                        </div>

                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <Button variant={"outline"} type="button" onClick={onBack}>
                        <ArrowLeft />
                        Voltar
                    </Button>

                    <Button type="submit">
                        Confirmar
                        <ArrowRight />
                    </Button>
                </div>
            </form>
        </Form>
    )
}