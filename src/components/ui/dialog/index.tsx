import { ReactNode } from "react";
import {
    Dialog as DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./primitives"


type DialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title?: string;
    children?: ReactNode;
    content: ReactNode;
    width?: string;
    height?: string;
    preventOutsideClick?: boolean;
}
export const Dialog = ({
    open,
    setOpen,
    title,
    children,
    content,
    width = "600px",
    height = "90vh",
    preventOutsideClick,
}: DialogProps) => {
    return (
        <DialogRoot open={open} onOpenChange={setOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent
                style={{ maxWidth: width, maxHeight: height }}
                className="overflow-y-auto"
                onInteractOutside={(e) => {
                    if (preventOutsideClick) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}>
                {title && (
                    <DialogHeader>
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                    </DialogHeader>
                )}
                {content}
            </DialogContent>
        </DialogRoot>
    )
}