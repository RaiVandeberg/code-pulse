import { Roles } from "@/@types/clerk"
import { auth } from "@clerk/nextjs/server"

export const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth()
    return sessionClaims?.metadata.roles === role
}