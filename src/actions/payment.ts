"use server";

import {

    calculateInstallmentsOptions,
    formatName,
    unMockValue,
} from "@/lib/utils";
import { ServerError } from "@/server/error";
import {
    creditCardCheckoutSchema,
    CreditCardCheckoutSchema,
    pixCheckoutSchema,
    PixCheckoutSchema,
} from "@/server/schemas/payment";
import { getUser } from "./user";
import { prisma } from "@/lib/prisma";
import { asaasApi } from "@/lib/asaas";
import { headers } from "next/headers";
import { isAxiosError } from "axios";

export const createPixCheckout = async (payload: PixCheckoutSchema) => {
    const input = pixCheckoutSchema.safeParse(payload);

    if (!input.success) {
        throw new ServerError({
            message: "Falha ao processar o pagamento",
            code: "INVALID_DATA",
        });
    }

    const {
        courseId,
        cpf: rawCpf,
        name,
        postalCode: rawPostalCode,
        addressNumber,
    } = input.data;

    const cpf = unMockValue(rawCpf);
    const postalCode = unMockValue(rawPostalCode);

    const { userId, user } = await getUser();

    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new ServerError({
            message: "Curso não encontrado",
            code: "NOT_FOUND",
        });
    }

    const userHasCourse = await prisma.coursePurchase.findFirst({
        where: {
            courseId,
            userId,
        },
    });

    if (userHasCourse) {
        throw new ServerError({
            message: "Você já possui acesso a este curso",
            code: "CONFLICT",
        });
    }

    let customerId = user?.asaasId;

    if (!customerId) {
        const { data: newCustomer } = await asaasApi.post("/customers", {
            name: name ?? formatName(user.fistName, user.lastName),
            email: user.email,
            cpfCnpj: cpf,
            postalCode,
            addressNumber,
        });

        if (!newCustomer) {
            throw new ServerError({
                message: "Falha ao processar o pagamento",
                code: "FAILED_TO_CREATE_CUSTOMER",
            });
        }

        customerId = newCustomer.id as string;

        await prisma.user.update({
            where: { id: userId },
            data: { asaasId: customerId },
        });
    }

    const price = course?.discountPrice ?? course?.price;

    const paymentPayload = {
        customer: customerId,
        billingType: "PIX",
        value: price,
        dueDate: new Date().toISOString().split("T")[0],
        description: `Compra do curso "${course.title}"`,
        externalReference: courseId,
    };

    const { data } = await asaasApi.post("/payments", paymentPayload);

    return {
        invoiceId: data.id as string,
    };
};

export const createCreditCardCheckout = async (
    payload: CreditCardCheckoutSchema
) => {
    const input = creditCardCheckoutSchema.safeParse(payload);

    if (!input.success) {
        throw new ServerError({
            message: "Falha ao processar o pagamento",
            code: "INVALID_DATA",
        });
    }

    const {
        courseId,
        name,
        cardCvv,
        cardNumber,
        cardValidThru,
        installments,
        cpf: rawCpf,
        addressNumber,
        phone,
        postalCode: rawPostalCode,
    } = input.data;

    const cpf = unMockValue(rawCpf);
    const postalCode = unMockValue(rawPostalCode);

    const { userId, user } = await getUser();

    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new ServerError({
            message: "Curso não encontrado",
            code: "NOT_FOUND",
        });
    }

    const userHasCourse = await prisma.coursePurchase.findFirst({
        where: {
            courseId,
            userId,
        },
    });

    if (userHasCourse) {
        throw new ServerError({
            message: "Você já possui acesso a este curso",
            code: "CONFLICT",
        });
    }

    let customerId = user?.asaasId;

    if (!customerId) {
        const { data: newCustomer } = await asaasApi.post("/customers", {
            name: name ?? formatName(user.fistName, user.lastName),
            email: user.email,
            cpfCnpj: cpf,
            postalCode,
            addressNumber,
        });

        if (!newCustomer) {
            throw new ServerError({
                message: "Falha ao processar o pagamento",
                code: "FAILED_TO_CREATE_CUSTOMER",
            });
        }

        customerId = newCustomer.id as string;

        await prisma.user.update({
            where: { id: userId },
            data: { asaasId: customerId },
        });
    }

    const price = course?.discountPrice ?? course?.price;

    const installmentOptions = calculateInstallmentsOptions(price);
    const installmentData = installmentOptions.find(
        (item) => item.installments === installments
    );

    const installmentTotal = installmentData?.total ?? price;

    const nextHeader = await headers();

    const remoteIp =
        nextHeader.get("x-real-ip") ||
        nextHeader.get("x-forwarded-for") ||
        nextHeader.get("x-client-ip");

    const paymentPayload = {
        customer: customerId,
        billingType: "CREDIT_CARD",
        value: installmentTotal,
        dueDate: new Date().toISOString().split("T")[0],
        description: `Compra do curso "${course.title}"`,
        externalReference: course.id,
        creditCard: {
            holderName: name,
            number: unMockValue(cardNumber),
            expiryMonth: cardValidThru.split("/")[0],
            expiryYear: cardValidThru.split("/")[1],
            ccv: cardCvv,
        },
        creditCardHolderInfo: {
            name,
            email: user.email,
            cpfCnpj: cpf,
            postalCode,
            addressNumber,
            phone,
        },
        remoteIp,
        installmentCount: installments > 1 ? installments : undefined,
        installmentValue:
            installments > 1 ? installmentData?.installmentValue : undefined,
    };

    try {
        await asaasApi.post("/payments", paymentPayload);
    } catch (error) {
        if (!isAxiosError(error)) {
            throw new ServerError({
                message: "Falha ao processar o pagamento",
                code: "FAILED_TO_CREATE_PAYMENT",
            });
        }

        console.error(error?.response?.data);

        const firstErrorDescription =
            (error?.response?.data?.errors?.[0]?.description as string) ?? "";

        if (firstErrorDescription.includes("não autorizada")) {
            throw new ServerError({
                code: "NOT_AUTHORIZED",
                message:
                    "Transação não autorizada. Verifique os dados do cartão de crédito e tente novamente.",
            });
        }

        throw new ServerError({
            message: "Falha ao processar o pagamento",
            code: "FAILED_TO_CREATE_PAYMENT",
        });
    }
};

export const getPixQrCode = async (invoiceId: string) => {
    await getUser();

    const { data } = await asaasApi.get<PixResponse>(
        `/payments/${invoiceId}/pixQrCode`
    );

    return data;
};

export const getInvoiceStatus = async (invoiceId: string) => {
    await getUser();

    const { data } = await asaasApi.get(`/payments/${invoiceId}`);

    return {
        status: data.status as string,
    };
};