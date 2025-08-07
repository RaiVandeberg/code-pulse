"use server"

import { calculateInstallmentsOptions, formatName, unMockValue } from "@/lib/utils";
import { ServerError } from "@/server/error";
import { creditCardCheckoutSchema, CreditCardCheckoutSchema, pixCheckoutSchema, PixCheckoutSchema } from "@/server/schemas/payment"
import { auth } from "@clerk/nextjs/server";
import { getUser } from "./user";
import { prisma } from "@/lib/prisma";
import { asaasApi } from "@/lib/asaas";
import { email } from "zod";
import { headers } from "next/headers";
import { isAxiosError } from "axios";



export const createPixCheckout = async (payload: PixCheckoutSchema) => {
    const input = pixCheckoutSchema.safeParse(payload);

    if (!input.success) {
        throw new ServerError({
            message: "Falha ao processar o pagamento.",
            code: "INVALID_DATA",
        })
    }

    const { courseId, cpf: rawCpf, postalCode: rawPostalCode, addressNumber } = input.data;

    const cpf = unMockValue(rawCpf);
    const postalCode = unMockValue(rawPostalCode);

    const { userId, user } = await getUser();

    const course = await prisma.course.findUnique({
        where: { id: courseId },
    })

    if (!course) {
        throw new ServerError({
            message: "Curso não encontrado.",
            code: "NOT_FOUND",
        });
    }

    const userHasCourse = await prisma.coursePurchase.findFirst({
        where: {
            courseId,
            userId,
        }
    });

    if (userHasCourse) {
        throw new ServerError({
            message: "Você já possui acesso a este curso.",
            code: "CONFLICT",
        });
    }

    let customersId = user?.asaasId;

    if (!customersId) {

        const { data: newCustomer } = await asaasApi.post("/customers", {
            name: user.fistName ?? formatName(user.fistName, user.lastName),
            email: user.email,
            cpfCnpj: cpf,
            postalCode,
            addressNumber
        })

        if (!newCustomer.id) {
            throw new ServerError({
                message: "Falha ao Processar o pagamento.",
                code: "FAILED_TO_CREATE_CUSTOMER",
            });
        }

        customersId = newCustomer.id as string;

        await prisma.user.update({
            where: { id: userId },
            data: { asaasId: customersId }
        });

    }

    const price = course.discountPrice ?? course.price;

    const paymentPayload = {
        customer: customersId,
        billingType: "PIX",
        value: price,
        dueDate: new Date().toISOString().split("T")[0],
        description: `Compra do curso ${course.title}`,
        externalReference: courseId,

    }

    const { data } = await asaasApi.post("/payments", paymentPayload);

    return {
        invoiceId: data.id as string,

    }
}

export const createCreditCardCheckout = async (payload: CreditCardCheckoutSchema) => {
    console.log("🔍 Payload recebido no backend:", payload);
    const input = creditCardCheckoutSchema.safeParse(payload);
    console.log("❌ Erro de validação Zod:", input.error?.format());

    if (!input.success) {
        throw new ServerError({
            message: "Falha ao processar o pagamento.",
            code: "INVALID_DATA",
        })
    }

    const { courseId, installments, cardNumber, cardValidThru, cardCvv, address, postalCode: rawPostalCode, addressNumber, phone, name, cpf: rawCpf } = input.data;

    const cpf = unMockValue(rawCpf);
    const postalCode = unMockValue(rawPostalCode);

    const { userId, user } = await getUser();

    const course = await prisma.course.findUnique({
        where: { id: courseId },
    })
    if (!course) {
        throw new ServerError({
            message: "Curso não encontrado.",
            code: "NOT_FOUND",
        });
    }

    const userHasCourse = await prisma.coursePurchase.findFirst({
        where: {
            courseId,
            userId,
        }
    });

    if (userHasCourse) {
        throw new ServerError({
            message: "Você já possui acesso a este curso.",
            code: "CONFLICT",
        });
    }


    let customersId = user?.asaasId;

    if (!customersId) {

        const { data: newCustomer } = await asaasApi.post("/customers", {
            name: user.fistName ?? formatName(user.fistName, user.lastName),
            email: user.email,
            cpfCnpj: cpf,
            postalCode,
            addressNumber
        })

        if (!newCustomer.id) {
            throw new ServerError({
                message: "Falha ao Processar o pagamento.",
                code: "FAILED_TO_CREATE_CUSTOMER",
            });
        }

        customersId = newCustomer.id as string;

        await prisma.user.update({
            where: { id: userId },
            data: { asaasId: customersId }
        });

    }
    const price = course.discountPrice ?? course.price;

    const installmentOptions = calculateInstallmentsOptions(price);
    const installmentData = installmentOptions.find((item) => item.installments === installments);

    const installmentTotal = installmentData?.total ?? price;

    const nextHeader = await headers();

    const remoteIp = nextHeader.get("x-real-ip") || nextHeader.get("x-forwarded-for") || nextHeader.get("x-client-ip");
    const sanitizedCardNumber = unMockValue(cardNumber)
    const paymentPayload = {
        customer: customersId,
        billingType: "CREDIT_CARD",
        value: installmentTotal,
        dueDate: new Date().toISOString().split("T")[0],
        description: `Compra do curso ${course.title}`,
        externalReference: courseId,
        creditCard: {
            holderName: name,
            number: sanitizedCardNumber, // limpo
            expirationMonth: cardValidThru.split("/")[0],
            expirationYear: cardValidThru.split("/")[1],
            cvv: cardCvv,
        },
        creditCardHolderInfo: {
            name,
            email: user.email,
            cpfCnpj: cpf,
            phone,
            address,
            postalCode,
            addressNumber,
        },
        remoteIp,
        installmentsCount: installments > 1 ? installments : undefined,
        installmentValue: installments > 1 ? installmentData?.installmentValue : undefined,



    }

    try {
        await asaasApi.post("/payments", paymentPayload);
    } catch (error) {
        console.log(paymentPayload, "payment payload");

        if (!isAxiosError(error)) {
            throw new ServerError({
                message: "Falha ao processar o pagamento.",
                code: "FAILED_TO_CREATE_PAYMENT",
            });
        }
        console.error(error.response?.data);

        const firstErrorDescription = error.response?.data.errors?.[0]?.description as string || "Erro desconhecido ao processar o pagamento.";
        if (firstErrorDescription.includes("não autorizada")) {
            throw new ServerError({
                message: "Transação não autorizada. Verifique os dados do cartão de crédito e tente novamente.",
                code: "NOT_AUTHORIZED",
            });
        }

        throw new ServerError({
            message: "Falha ao processar o pagamento.",
            code: "FAILED_TO_CREATE_PAYMENT",
        });
    }

}

export const getPixQrCode = async (invoiceId: string) => {
    await getUser();

    const { data } = await asaasApi.get<PixResponse>(`/payments/${invoiceId}/pixQrCode`);

    return data;
}

export const getInvoiceStatus = async (invoiceId: string) => {
    await getUser();
    const { data } = await asaasApi.get(`/payments/${invoiceId}`);

    return {
        status: data.status as string,
    }
}