export { }

export type Roles = "admin" | "member";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            roles?: Roles;
        }
    }
}