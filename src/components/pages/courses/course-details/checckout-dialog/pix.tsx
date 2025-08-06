"use client"

import { createPixCheckout, getInvoiceStatus, getPixQrCode } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form/field";
import { InputField } from "@/components/ui/form/input-fiel";
import { Form } from "@/components/ui/form/primitives";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { unMockValue } from "@/lib/utils";
import { pixCheckoutFormSchema } from "@/server/schemas/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { on } from "events";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { set } from "zod";

type FormData = z.infer<typeof pixCheckoutFormSchema>;


export type PixResponse = {
    encodedImage: string;
    payload: string;
    expirationDate: string;
}

type PixFormProps = {
    onBack: () => void;
    course: Course
    onClose: () => void;
}

export const PixForm = ({ onBack, course, onClose }: PixFormProps) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(true);
    const [invoiceId, setInvoiceId] = useState<string | null>(null);
    const [pixData, setPixData] = useState<PixResponse | null>(null);
    const [checkStatusIsDisabled, setCheckStatusIsDisabled] = useState(false);


    const form = useForm<FormData>({
        resolver: zodResolver(pixCheckoutFormSchema),
        defaultValues: {
            name: "",
            addressNumber: "",
            postalCode: "",
            cpf: "",
        }
    })

    const { handleSubmit, watch, setError } = form;
    const rawCep = watch("postalCode");
    const { mutateAsync: handleGetStatus, isPending: isLoading } = useMutation({
        mutationFn: getInvoiceStatus,

    })
    const { mutateAsync: validateCep, isPending: isValidatingCep } = useMutation({
        mutationFn: async () => {
            try {
                const cep = unMockValue(rawCep);
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (response.data.erro) {
                    setError("postalCode", { type: "manual", message: "CEP inválido." });
                    return false
                }

            } catch (error) {

            }
        }
    })
    const { mutate: handleGetQrCode, } = useMutation({
        mutationFn: getPixQrCode,
        onSuccess: (data) => {
            setIsGenerating(false);
            setPixData(data);
        }
    })
    const { mutateAsync: handleCreateInvoice, isPending: isCreatingInvoice } = useMutation({
        mutationFn: createPixCheckout,
        onSuccess: (response) => {
            setStep(2);
            setInvoiceId(response.invoiceId);
            handleGetQrCode(response.invoiceId);
        }
    })

    const onSubmit = (data: FormData) => {
        const isValid = validateCep();
        if (!isValid) return;

        toast.promise(handleCreateInvoice({
            courseId: course.id,
            cpf: data.cpf,
            postalCode: data.postalCode,
            addressNumber: data.addressNumber,
            name: data.name,
        }), { loading: "Gerando QR Code..." })
    }

    const handleCopy = () => {
        if (!pixData?.payload) return;
        navigator.clipboard.writeText(pixData.payload);
        toast.success("Código copiado para a área de transferência!");
    }

    const handleConfirmPayment = async () => {
        if (!invoiceId) return;

        if (checkStatusIsDisabled) {
            toast.error("Aguarde o processamento do pagamento antes de verificar o status.");
            return;
        };

        setCheckStatusIsDisabled(true);
        setTimeout(() =>
            setCheckStatusIsDisabled(false), 5000);
        const { status } = await handleGetStatus(invoiceId);

        switch (status) {
            case "PENDING":
                toast.info("Pagamento em processamento. Caso haja instabilidade poderá levar alguns minutos para ser confirmado.");
                break;
            case "RECEIVED":
                toast.success("Pagamento efetuado com sucesso!");
                onClose();
                toast.success("Agradecemos pela compra do curso!, voce será redirecionado para a página do curso.");

                await new Promise(resolve => setTimeout(resolve, 4000));
                router.push(`/courses/${course.slug}`);
                break;
        }
    }

    const handleBack = () => {
        if (step === 1) {
            onBack();
            return;
        }
        setStep(1)
    }
    return (
        <Form {...form}>
            <form className=" flex flex-col items-center " onSubmit={handleSubmit(onSubmit)}>
                {step === 1 ? (
                    <div className="w-full">
                        <h2 className="mt-2 mb-3 text-center">
                            Para gerar o QR Code, preencha os dados abaixo:
                            <span className="text-sm block opacity-50">(Serão utilizados apenas para emissão de nota fiscal.)</span>
                        </h2>


                        <div className="w-full grid sm:grid-cols-2 gap-2">
                            <InputField name="name" placeholder="Nome completo" />
                            <InputField name="cpf" mask="___.___.___-__" placeholder="CPF" />
                            <InputField name="postalCode" mask="_____-___" placeholder="CEP" />
                            <FormField name="addressNumber">
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        onChange={({ target }) => {
                                            const value = target.value.replace(/\D/g, "")
                                            field.onChange(value)
                                        }}
                                        placeholder="Numero da residência"
                                    />
                                )}
                            </FormField>
                        </div>
                    </div>

                ) : (
                    <>
                        <div className="bg-primary w-[300px] aspect-square rounded-sl p-3 flex items-center justify-center mt-2">
                            {pixData?.encodedImage && (
                                <img
                                    src={`data:image/png;base64,${pixData.encodedImage}`}
                                    className="w-full h-full rounded-lg object-contain"
                                    alt="QR Code do PIX"
                                />
                            )}
                            {isGenerating && <Skeleton className="w-full h-full rounded-lg" />}
                        </div>
                        <p className="my-4 px-13 text-center">Escaneie o QR Code ou copie e cole o codigo acima no seu app bancario para finalizar o pagamento.</p>
                        <div className="flex gap-2 w-full max-w-[500px]">
                            <Input
                                placeholder="Gerando QR Code..."
                                value={pixData?.payload ?? ""}
                                readOnly
                            />
                            <Button disabled={!pixData} onClick={handleCopy}>
                                Copiar
                                <Copy />
                            </Button>
                        </div>

                    </>
                )}

                <div className="mt-6 flex items-center justify-between w-full flex-col md:flex-row gap-4 md:gap-0 ">
                    <Button type="button" variant={"outline"} className="w-full md:w-max" onClick={handleBack}>
                        <ArrowLeft />
                        Voltar
                    </Button>

                    {step === 1 ? (
                        <Button type="submit" className="w-full md:w-max" disabled={isCreatingInvoice || isValidatingCep}>
                            Continuar
                            <ArrowRight />
                        </Button>
                    ) : (
                        <Button type="button" disabled={!pixData || isLoading} className="w-full md:w-max" onClick={handleConfirmPayment} >
                            Confirmar Pagamento
                            <Check />
                        </Button>
                    )}

                </div>
            </form>
        </Form>
    )
}
