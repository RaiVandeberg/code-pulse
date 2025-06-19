export { }

export type Roles = "admin" | "member";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        }
    }
}