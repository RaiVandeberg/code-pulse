"use server"

import { formatName, unMockValue } from "@/lib/utils";
import { ServerError } from "@/server/error";
import { pixCheckoutSchema, PixCheckoutSchema } from "@/server/schemas/payment"
import { auth } from "@clerk/nextjs/server";
import { getUser } from "./user";
import { prisma } from "@/lib/prisma";
import { asaasApi } from "@/lib/asaas";
import { email } from "zod";


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