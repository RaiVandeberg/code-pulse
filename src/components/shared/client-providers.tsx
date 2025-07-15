"use client"

import { queryClient } from "@/lib/tanstack-query";
import { QueryClientProvider } from "@tanstack/react-query";

type ClientProvidersProps = {
    children: React.ReactNode;
}

export const ClientProviders = ({ children }: ClientProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}