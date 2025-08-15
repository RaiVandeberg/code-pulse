import { useState } from "react"
import {
    AlertDialog as AlertDialogRoot,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./primitives"
import { toast } from "sonner"

type AlertDialogProps = {
    children: React.ReactNode
    title: string
    description: string
    onConfirm: () => void | Promise<void>
    toastMessage?: string;
}

export const AlertDialog = ({ children, title, description, onConfirm, toastMessage }: AlertDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        try {
            setIsLoading(true)
            await onConfirm()
            setIsOpen(false)
            if (toastMessage) {
                toast.success(toastMessage)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialogRoot open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={handleConfirm}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogRoot>
    )
}