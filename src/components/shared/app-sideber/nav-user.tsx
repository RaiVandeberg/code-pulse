import { Button } from "@/components/ui/button"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"


export const NavUser = () => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="p-2">
                    <Link href="/auth/sign-in" passHref className="w-full">

                        <Button size="sm" variant="outline" className="w-full">
                            Entrar
                        </Button>
                    </Link>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}