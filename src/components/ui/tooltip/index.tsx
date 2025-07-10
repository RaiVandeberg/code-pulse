import { Children } from "react";
import { Tooltip as TooltipRoot, TooltipProvider, TooltipTrigger, TooltipContent } from "./primitives";


type TooltipProps = {
    children: React.ReactNode;
    content?: string;
}
export const Tooltip = ({ children, content, ...props }: TooltipProps) => {
    return (
        <TooltipProvider>
            <TooltipRoot>
                <TooltipTrigger asChild {...props}>{children}</TooltipTrigger>
                <TooltipContent>
                    {content}
                </TooltipContent>
            </TooltipRoot>
        </TooltipProvider>
    );
}

