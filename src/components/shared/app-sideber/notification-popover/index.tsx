import { getNotifications, readAllNotification } from "@/actions/notification"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip } from "@/components/ui/tooltip"
import { queryKeys } from "@/constants/query-key"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { NotificationItem } from "./notification-item"
import { useEffect, useState } from "react"
import { queryClient } from "@/lib/tanstack-query"
import { useIsMobile } from "@/hooks/use-mobile"

export const NotificationPopover = () => {

    const { data: notification } = useQuery({
        queryKey: queryKeys.notifications,
        queryFn: getNotifications,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60 * 5 // 5 minutes
    })
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState("unread")
    const allNotifications = notification ?? []
    const unreadNotifications = allNotifications.filter(n => !n.readAt)

    const isMobile = useIsMobile()
    useEffect(() => {
        if (!!notification) {
            const unreadLength = notification.filter(item => !item.readAt).length

            if (unreadLength <= 0) {
                setTab("all")
            }
        }
    }, [notification])

    const hasUnreadNotifications = !!unreadNotifications.length

    const { mutate: handleMarkAllAsRead, } = useMutation({
        mutationFn: readAllNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
        }
    })

    const handleClosed = () => {
        if (hasUnreadNotifications) {
            handleMarkAllAsRead()
        }
        setOpen(false)
    }

    return (
        <div>
            <Popover
                open={open}
                onOpenChange={(value) => {
                    if (value && hasUnreadNotifications) setTab("unread")
                    if (!value) {
                        return handleClosed()
                    }
                    setOpen(value)
                }} >
                <PopoverTrigger asChild>
                    <Tooltip content="Notificações">
                        <Button variant={"ghost"} size={"icon"} className="relative">
                            <Bell />
                            {hasUnreadNotifications && (
                                <div className="absolute h-2 w-2 rounded-full bg-primary -top-0.5 -right-0.5">
                                    <div className="w-full h-full rounded-full animate-ping bg-primary ">

                                    </div>
                                </div>
                            )}
                        </Button>
                    </Tooltip>

                </PopoverTrigger>
                <PopoverContent
                    sideOffset={18}
                    side={isMobile ? "top" : "right"}
                    align={isMobile ? "center" : "end"}
                    className="w-[380px] max-w-screen">
                    <p className="font-semibold mb-2">Notificações</p>
                    <Tabs className="w-full"
                        value={tab} onValueChange={setTab}>
                        <TabsList>
                            <TabsTrigger value="unread">
                                Não lidas
                            </TabsTrigger>
                            <TabsTrigger value="all">
                                Todas
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="unread"
                            className="max-h-[250px] overflow-y-auto">
                            {!unreadNotifications.length && (
                                <p className="p-2 text-sm text-muted-foreground">
                                    Você não tem notificações.
                                </p>
                            )}
                            {unreadNotifications.map((notification) => (
                                <NotificationItem
                                    onClick={handleClosed}
                                    key={notification.id} notification={notification} />
                            ))}
                        </TabsContent>
                        <TabsContent
                            value="all"
                            className="max-h-[250] overflow-y-auto">

                            {allNotifications.length === 0 && (
                                <p className="p-2 text-sm text-muted-foreground">
                                    Você não tem notificações.
                                </p>
                            )}
                            {allNotifications.map((notification) => (
                                <NotificationItem
                                    onClick={handleClosed}
                                    key={notification.id} notification={notification} />
                            ))}
                        </TabsContent>

                    </Tabs>
                </PopoverContent>
            </Popover>
        </div>
    )
}