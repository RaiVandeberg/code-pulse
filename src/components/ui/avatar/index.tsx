import { cn } from "@/lib/utils"
import { Avatar as AvatarRoot, AvatarFallback, AvatarImage } from "./primitives"

type AvatarProps = {
    src?: string | null
    fallback?: string | null
    className?: string
}

export const Avatar = ({ src, fallback, className }: AvatarProps) => {
    return (
        <AvatarRoot className={cn("w-8 h-8 rounded-lg", className)}>
            <AvatarImage
                src={src ?? undefined}
                alt={fallback ?? ""}
            />
            <AvatarFallback className="rounded-lg" />
        </AvatarRoot>
    )
}