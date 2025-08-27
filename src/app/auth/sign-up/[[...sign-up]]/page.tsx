import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return <SignUp signInUrl="/auth/sign-up" />;
}