"use client";

import "@/styles/react-credit-card.css";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowRight, CreditCard, MessageSquareQuote } from "lucide-react";
import { useState } from "react";
import PixIcon from '@/assets/pix.svg'

import { CreditCardForm } from "./credit-card";
import { PixForm } from "./pix";



type CheckoutDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    course: Course;
}
export const CheckoutDialog = ({ open, setOpen, course }: CheckoutDialogProps) => {

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "BOLETO">("PIX");

    const handleContinue = () => {
        //TODO VALIDAR SE ESTA LOGADO
        setStep(2);
    }
    const handleBack = () => {

        setStep(1)
    }
    const paymentMethods = [
        {
            label: "Pix",
            value: "PIX" as const,
            Icon: PixIcon
        },
        {
            label: "Cartão de Crédito",
            value: "CREDIT_CARD" as const,
            Icon: CreditCard,
        },
        // {
        //     label: "Boleto",
        //     value: "BOLETO" as const,
        //     Icon: BoletoIcon,
        // }
    ]
    const handleClose = () => {
        setOpen(false);

    }
    return (
        <Dialog
            open={open}
            setOpen={setOpen}
            title="Concluir Compra"
            height="95vh"
            preventOutsideClick
            content={
                <div className="pt-4">
                    {step === 1 && (
                        <div className="flex flex-col">
                            <h2 className="mb-3">
                                Métodos de pagamento
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {paymentMethods.map((method) => (
                                    <Button
                                        key={method.value}
                                        className={cn(
                                            "h-auto w-full items-center justify-center gap-3 rounded-xl text-lg font-lg font-semibold disabled:opacity-50",
                                            "!hover:border-primary",
                                            paymentMethod !== method.value && "!bg-primary/10 text-primary !border-primary hover:text-primary"
                                        )}
                                        onClick={() => {
                                            setPaymentMethod(method.value);
                                        }}
                                    >
                                        <method.Icon className="w-6 min-w-6 h-6 min-h-6" />
                                        {method.label}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                className="mt-6 ml-auto"
                                onClick={handleContinue}
                                disabled={!paymentMethod}
                            >
                                Continuar
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && paymentMethod === "PIX" &&

                        <PixForm onBack={handleBack} course={course} onClose={handleClose} />

                    }

                    {step === 2 && paymentMethod === "CREDIT_CARD" && (
                        <div className="flex flex-col gap-4">
                            <CreditCardForm onBack={handleBack} />
                        </div>
                    )}
                </div>}
        >


        </Dialog>
    );
}