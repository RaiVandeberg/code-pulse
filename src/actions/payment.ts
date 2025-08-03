"use server"

import { unMockValue } from "@/lib/utils";
import { ServerError } from "@/server/error";
import { pixCheckoutSchema, PixCheckoutSchema } from "@/server/schemas/payment"
import { auth } from "@clerk/nextjs/server";
import { getUser } from "./user";
import { prisma } from "@/lib/prisma";


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

    const { userId } = await getUser();

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
}