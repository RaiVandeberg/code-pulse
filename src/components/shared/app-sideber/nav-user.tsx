"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useClerk, useUser } from "@clerk/nextjs"
import { BadgeCheck, ChevronsUpDown, LogIn, LogOut } from "lucide-react"
import Link from "next/link"


export const NavUser = () => {
    const { user, isLoaded } = useUser()
    const { openUserProfile, signOut } = useClerk()


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                <Avatar
                                    src={user.imageUrl}
                                    fallback={user.fullName}
                                />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.fullName}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.primaryEmailAddress?.emailAddress}
                                    </span>
                                </div>

                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg"
                            side="top"
                            align="end"
                            sideOffset={4}>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar
                                        src={user.imageUrl}
                                        fallback={user.fullName}
                                    />
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {user.fullName}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user.primaryEmailAddress?.emailAddress}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => openUserProfile()}>
                                    <BadgeCheck />
                                    Gerenciar  conta
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <Separator className="my-1" />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                                    <LogOut />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                ) : (
                    <>{!isLoaded ? (
                        <Skeleton />
                    ) : (
                        <div className="p-2">
                            <Link href="/auth/sign-in" passHref className="w-full">
                                <Button size="sm" variant="outline" className="w-full">
                                    <LogIn />
                                    Entrar
                                </Button>
                            </Link>
                        </div>
                    )}</>
                )}
            </SidebarMenuItem>
        </SidebarMenu>
    )
}