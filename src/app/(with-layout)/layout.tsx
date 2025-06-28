"use client";
import { AppSidebar } from "@/components/shared/app-sideber";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, Suspense } from "react";

type LayoutProps = {
    children: ReactNode;
}



export default function Layout({ children }: LayoutProps) {

    const { user } = useUser();
    const pathname = usePathname()
    const isHomePage = pathname === "/";
    const isCoursePage = /^\/courses\/(?!details\/).+/.test(pathname);
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className={cn("flex h-[70px] shrink-0 border-b items-center px-6 justify-between gap-2",
                        !isHomePage && "md:hidden"
                    )}>
                        <div className="flex-1 flex items-center gap-4">
                            <SidebarTrigger className="flex md:hidden -ml-1" />
                            {!isHomePage && (
                                <Suspense>

                                    <SearchInput />
                                </Suspense>
                            )}

                        </div>
                        {!user && (<Link href="/auth/sign-in">
                            <Button size="sm">
                                <LogIn />
                                Entrar
                            </Button>
                        </Link>)}
                    </header>
                    <div className={cn("flex flex-1 flex-col gap-6 p-6 overflow-auto",
                        isCoursePage && "p-0"
                    )}>
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
