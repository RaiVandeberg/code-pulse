"use client"
import { useParams } from "next/navigation"
import { CommentInput } from "./comment-input"
import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/constants/query-key"
import { getLessonComments } from "@/actions/course-comments"
import { Skeleton } from "@/components/ui/skeleton"
import { CommentItem } from "./comment-item"

export const LessonComments = () => {

    const params = useParams()
    const lessonId = params.lessonId as string

    const { data: comments } = useQuery({
        queryKey: queryKeys.lessonComments(lessonId),
        queryFn: () => getLessonComments(lessonId),
        enabled: !!lessonId,
    })
    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold">Comentários</h3>
            {!comments ? (
                <Skeleton className="w-full min-h-[200px] " />
            ) : (
                <>
                    {!comments.length && (
                        <p className="text-muted-foreground text-sm mb-2">
                            Nenhum comentário encontrado. Seja o primeiro a comentar!
                        </p>
                    )}
                    <div className="flex flex-col gap-3">
                        {comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                    <CommentInput />
                </>
            )}
        </div>
    )
}