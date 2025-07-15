"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export const getUser = async () => {

    const { userId } = await auth()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    return {
        user,
        clerkUserId: userId,
        userId: user.id
    }
}