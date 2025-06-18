import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator";
import { BookOpen, BookUp2, ChartArea, MessageCircle, SquareDashedBottomCode, Trophy, User } from "lucide-react"
import Link from "next/link";
import path from "path"


type NavItems = {
    label: string;
    path: string;
    icon: React.ElementType;
}

export const NavItems = () => {

    const NavItems: NavItems[] = [
        {
            label: "Cursos",
            path: "/",
            icon: SquareDashedBottomCode
        },
        {
            label: "Meus Cursos",
            path: "/my-cursos",
            icon: BookUp2
        },
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
                <SidebarSeparator className="my-2 m-1 flex" />
                {handleNavItemClick(adminNavItems)}
            </SidebarMenu>
        </SidebarGroup>
    )
}