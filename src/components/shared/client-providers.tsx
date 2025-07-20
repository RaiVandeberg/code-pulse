"use client"

import { queryClient } from "@/lib/tanstack-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../ui/sonner";
import { use, useEffect } from "react";
import { setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";

type ClientProvidersProps = {
    children: React.ReactNode;
}

export const ClientProviders = ({ children }: ClientProvidersProps) => {
    useEffect(() => {
        setDefaultOptions({ locale: ptBR })
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster richColors />
            {children}
        </QueryClientProvider>
    )
}