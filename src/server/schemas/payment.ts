import { z } from "zod";

export const cpfSchema = z.string().refine((cpf: string) => {
    if (typeof cpf !== "string") return false;
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    const cpfDigits = cpf.split("").map((el) => +el);
    const rest = (count: number): number => {
        return (
            ((cpfDigits
                .slice(0, count - 12)
                .reduce((acc, el, index) => acc + el * (count - index), 0) *
                10) %
                11) %
            10
        );
    };
    return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
}, "Digite um CPF válido.");

export type PixCheckoutSchema = z.infer<typeof pixCheckoutSchema>;


export const pixCheckoutFormSchema = z.object({

    name: z.string().nonempty({ message: "Digite seu nome." }),
    postalCode: z.string().nonempty({ message: "Digite o CEP." }),
    addressNumber: z.string().nonempty({ message: "Digite o número do endereço." }),
    cpf: cpfSchema,
});


export const pixCheckoutSchema = pixCheckoutFormSchema.extend({
    courseId: z.string().nonempty(),
});





export const creditCardCheckoutFormSchema = z.object({
    name: z.string().nonempty({
        message: "Digite seu nome.",
    }),
    cardNumber: z
        .string()
        .nonempty({
            message: "Digite o número do cartão.",
        })
        .regex(/^\d{4} \d{4} \d{4} \d{4}$/, {
            message: "Número de cartão inválido.",
        }),
    cardValidThru: z
        .string()
        .nonempty({
            message: "Digite a validade do cartão.",
        })
        .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
            message: "Digite uma validade válida (MM/AA).",
        })
        .refine(
            (value) => {
                const [month, year] = value.split("/").map(Number);
                const currentDate = new Date();
                // @ts-expect-error - This is a valid date
                const inputDate = new Date(`20${year}`, month - 1);
                return (
                    inputDate >=
                    new Date(currentDate.getFullYear(), currentDate.getMonth())
                );
            },
            {
                message: "Validade inválida.",
            }
        ),
    cardCvv: z
        .string()
        .nonempty({
            message: "Digite o CVV do cartão.",
        })
        .regex(/^\d{3,4}$/, {
            message: "O CVV deve ter 3 ou 4 dígitos.",
        }),
    installments: z
        .number()
        .int()
        .min(1, {
            message: "Selecione o número de parcelas.",
        })
        .max(6, {
            message: "O número máximo de parcelas é 6.",
        }),

    cpf: cpfSchema,
    address: z.string().optional(),
    postalCode: z.string().nonempty({
        message: "Digite o CEP.",
    }),
    addressNumber: z.string().nonempty({
        message: "Digite o número do endereço.",
    }),
    phone: z
        .string()
        .min(10, {
            message: "Telefone inválido.",
        })
        .nonempty({
            message: "Digite o telefone.",
        }),
});

export const creditCardCheckoutSchema = creditCardCheckoutFormSchema.extend({
    courseId: z.string().nonempty(),
});

export type CreditCardCheckoutSchema = z.infer<typeof creditCardCheckoutSchema>;