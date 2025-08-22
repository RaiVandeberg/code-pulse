"use server"

import { checkRole } from "@/lib/clerk"
import { prisma } from "@/lib/prisma"
import { createNotificationSchema, CreateNotificationSchema } from "@/server/schemas/notification"


export const sendNotifications = async (rawData: CreateNotificationSchema) => {
    const isAdmin = await checkRole("admin");

    if (!isAdmin) throw new Error("Unauthorized");

    const data = createNotificationSchema.parse(rawData);

    const allUserIds = await prisma.user.findMany({
        select: {
            id: true,
        },
    });

    await prisma.notification.createMany({
        data: allUserIds.map((user) => ({
            userId: user.id,
            title: data.title,
            content: data.content,
            link: data.link,
        })),
    });
};