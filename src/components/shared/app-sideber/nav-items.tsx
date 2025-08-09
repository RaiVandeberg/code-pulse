"use client";
import { getPurchaseCourses } from "@/actions/courses";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar"
import { queryKeys } from "@/constants/query-key";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, BookUp2, ChartArea, MessageCircle, SquareDashedBottomCode, Trophy, User } from "lucide-react"
import Link from "next/link";
import path from "path"


type NavItems = {
    label: string;
    path: string;
    icon: React.ElementType;
}

export const NavItems = () => {

    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    const { data: purchasedCourses } = useQuery({
        queryKey: queryKeys.purchasedCourses,
        queryFn: () => getPurchaseCourses(),
    })

    const NavItems: NavItems[] = [
        {
            label: "Cursos",
            path: "/",
            icon: SquareDashedBottomCode
        },
        ...(!!purchasedCourses?.length ? [
            {
                label: "Meus Cursos",
                path: "/my-course",
                icon: BookUp2
            },
        ] : []),
        {
            label: "Ranking",
            path: "/ranking",
            icon: Trophy
        }
    ];

    const adminNavItems: NavItems[] = [
        {
            label: "Estatisticas",
            path: "/admin",
            icon: ChartArea
        },
        {
            label: "Gerenciar Cursos",
            path: "/admin/courses",
            icon: BookOpen
        },
        {
            label: "Gerenciar Usuários",
            path: "/admin/users",
            icon: User
        },
        {
            label: "Gerenciar Comentários",
            path: "/admin/comments",
            icon: MessageCircle
        }

    ]

    const handleNavItemClick = (items: NavItems[]) => {
        return items.map((item) => (
            <SidebarMenuItem key={item.label} >
                <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.path}>
                        <item.icon className="text-primary group-data-[collapsed=icon]:text-white hover:text-primary transition-all" />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))
    }
    return (
        <SidebarGroup className="flex justify-center items-center">
            <SidebarMenu>
                {handleNavItemClick(NavItems)}

                {isAdmin && (
                    <>
                        <SidebarSeparator className="my-2 m-1 flex" />
                        {handleNavItemClick(adminNavItems)}
                    </>
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}