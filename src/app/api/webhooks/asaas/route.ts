import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";




export const POST = async (request: Request) => {
    try {
        const headersList = await headers()
        const token = headersList.get("asaas-access-token");

        if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
            return new Response("unauthorized", {
                status: 401,
            });
        }

        const body = await request.json();

        const { event, payment } = body;
        if (!event || !payment) {
            return new Response("bad request", {
                status: 400,
            });
        }

        const customerId = payment.customer;
        const courseId = payment.externalReference;

        const user = await prisma.user.findFirst({
            where: {
                asaasId: customerId,
            },
        });

        if (!user) {
            return new Response("Customer not found", {
                status: 404,
            });
        }

        switch (event) {
            case "PAYMENT_RECEIVED":
            case "PAYMENT_CONFIRMED":
                if (event === "PAYMENT_RECEIVED" && payment.billingType !== "PIX") {
                    return new Response("WebHook received", {
                        status: 200,
                    });
                }
                const userAlreadyHasCourse = await prisma.coursePurchase.findFirst({
                    where: {
                        userId: user.id,
                        courseId,
                    },
                });

                if (!userAlreadyHasCourse) {
                    await prisma.coursePurchase.create({
                        data: {
                            courseId,
                            userId: user.id,
                        },
                    });
                }

                return new Response("WebHook received", {
                    status: 200,
                });
            case "PAYMENT_REFUNDED":

                const userHasCourse = await prisma.coursePurchase.findFirst({
                    where: {
                        userId: user.id,
                        courseId,
                    },
                });

                if (userHasCourse) {
                    await prisma.coursePurchase.delete({
                        where: {
                            id: userHasCourse.id,
                        },
                    });
                    await prisma.completedLesson.deleteMany({
                        where: {
                            userId: user.id,
                            courseId,
                        },
                    });
                }
                return new Response("WebHook received", {
                    status: 200,
                });
            default:
                return new Response("Unhandled event", {
                    status: 200,
                });
        }


    } catch (error) {
        console.error(error);


        return new Response("internal server error", {
            status: 500,
        });
    }
}