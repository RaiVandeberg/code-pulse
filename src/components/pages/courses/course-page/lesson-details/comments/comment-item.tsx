import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, formatName } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageSquareQuote, Trash } from "lucide-react";


type CommentItemProps = {
    comment: LessonCommentWithUserAndReplies;
}

export const CommentItem = ({ comment }: CommentItemProps) => {

    const user = comment.user;
    const authorName = formatName(user.fistName, user.lastName);
    const distanceToNow = formatDistanceToNow(comment.createdAt, {
        addSuffix: true,
    });
    const actions = [
        {
            label: "Deletar",
            icon: Trash,
            onClick: () => { },
            hidden: false,
            disable: false,
        },
        {
            label: "Responder",
            icon: MessageSquareQuote,
            onClick: () => { },
            hidden: false,
            disable: false,
        }
    ]
    return (
        <div className={cn("p-4 rounded-lg bg-gray-950 flex flex-col gap-3 text-sm",)}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Avatar src={user.imageUrl} fallback={authorName} />
                    <p className="">{authorName}</p>
                    <span className="text-xs text-muted-foreground"> {distanceToNow} </span>
                </div>

                <div className="flex items-center gap-2">
                    {actions.map((action) => {
                        if (action.hidden) return null;
                        return (
                            <Tooltip
                                key={`comment-${comment.id}-${action.label}`}
                                content={action.label}
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={action.onClick}
                                    disabled={action.disable}
                                >

                                    <action.icon className="h-4 w-4" />
                                </Button>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>

            <p className="text-muted-foreground">{comment.content}</p>
        </div>
    )
}