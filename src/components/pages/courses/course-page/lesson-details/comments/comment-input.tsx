"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { create } from "domain"
import { createLessonComment } from "@/actions/course-comments"
import { queryKeys } from "@/constants/query-key"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { on } from "events"


const formSchema = z.object({
    content: z.string().min(2, { message: "Comentário Obrigatorio" }).max(500, { message: "Comentário pode ter no maximo 500 caracteres" })
})

type FormData = z.infer<typeof formSchema>

type CommentInputProps = {
    parentCommentId?: string;
    autoFocus?: boolean;
    onCancel?: () => void;
    onSuccess?: () => void;
    className?: string;
}

export const CommentInput = ({
    parentCommentId,
    autoFocus,
    onCancel,
    onSuccess,
    className
}: CommentInputProps) => {
    const queryClient = useQueryClient();
    const params = useParams();
    const lessonId = params.lessonId as string;
    const courseSlug = params.slug as string;
    const { user } = useUser()
    const { control, handleSubmit, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })
    const { mutate: createComment, isPending } = useMutation({
        mutationFn: createLessonComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.lessonComments(lessonId)
            });
            reset()
            if (onSuccess) onSuccess()
            toast.success("Comentário criado com sucesso")
        },
        onError: () => {
            toast.error("Erro ao criar comentário")
        }
    })

    const onSubmit = (data: FormData) => {
        createComment({
            courseSlug,
            lessonId,
            content: data.content,
            parentId: parentCommentId
        })
    };
    return (
        <form className={cn("flex gap-4", className)} onSubmit={handleSubmit(onSubmit)}>
            <Avatar src={user?.imageUrl} fallback={user?.fullName} />
            <Controller
                control={control}
                name="content"
                render={({ field }) => (
                    <Textarea
                        {...field}
                        placeholder="Deixe seu comentário" className="min-h-[100px]" {...field}
                        autoFocus={autoFocus} />
                )}
            />
            <div className="flex  gap-2">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel} disabled={isPending}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>Comentar</Button>
            </div>
        </form>
    )
}