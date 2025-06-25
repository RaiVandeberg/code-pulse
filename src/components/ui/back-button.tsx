"use client"

import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ComponentProps } from "react"

type BackButtonProps = ComponentProps<"button">

export const BackButton = ({ className, ...props }: BackButtonProps) => {
    const router = useRouter()
    return (
        <button
            {...props}
            type="button"
            className={cn("flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-all max-w-max", className)}
            onClick={() => router.back()}
        >
            <ArrowLeft size={16} />
            Voltar

        </button>
    )
}