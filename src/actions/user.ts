"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

type FilledUser = {
    user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>
    clerkUserId: string
    userId: string
}

type EmptyUser = {
    user: null
    clerkUserId: null
    userId: null
}

//function overload for getUser
export function getUser(throwError?: true): Promise<FilledUser>
export function getUser(throwError: false): Promise<FilledUser | EmptyUser>

export async function getUser(throwError = true): Promise<FilledUser | EmptyUser> {

    const { userId } = await auth()

    const emptyUser: EmptyUser = {
        user: null,
        clerkUserId: null,
        userId: null
    }
    if (!userId) {
        if (!throwError) return emptyUser;
        throw new Error("Unauthorized")
    }


    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        if (!throwError) return emptyUser;
        throw new Error("User not found")
    }

    return {
        user,
        clerkUserId: userId,
        userId: user.id
    }
}