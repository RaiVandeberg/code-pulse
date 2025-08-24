import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { BadgeInfo } from "lucide-react";
import Link from "next/link";

type NotificationItemProps = {
    notification: PlatformNotification;
    onClick: () => void;
};

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {

    const link = notification.link

    const Container = link ? Link : "div"
    const containerProps = link ? { href: link } : {}
    return (
        //@ts-expect-error - link is optional
        <Container
            {...containerProps}
            className={cn("flex items-center gap-3 p-2 rounded-lg cursor-default",
                !!link && "hover:bg-muted cursor-pointer"
            )}
            onClick={onClick}>
            <BadgeInfo className="w-6 h-6 min-w-6 text-primary" />
            <div className="flex-1  ">
                <div className="flex items-center justify-between mb-1 text-muted-foreground">
                    <p className="text-sm font-bold line-clamp-1">{notification.title}</p>
                    <p className="text-xs line-clamp-1"
                    >{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</p>
                </div>
                <p className="text-sm">{notification.content}</p>
            </div>

        </Container>
    )
}