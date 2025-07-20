"use server"

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";
import { checkRole } from "@/lib/clerk";


export const getLessonComments = async (lessonId: string) => {
    await getUser()
    const comments = await prisma.lessonComment.findMany({
        where: { lessonId, parentId: null },
        include: {
            user: true,
            parent: true,
            replies: {
                include: {
                    user: true,

                },
            },
        },
        orderBy: {
            createdAt: "asc"
        },
    })
    return comments
}

type CreateLessonCommentPayload = {
    courseSlug: string;
    lessonId: string;
    content: string;
    parentId?: string;

}
export const createLessonComment = async ({ courseSlug, lessonId, content, parentId }: CreateLessonCommentPayload) => {
    const { userId } = await getUser()

    if (content.length > 500) {
        throw new Error("Comentário pode ter no máximo 500 caracteres")
    }

    const course = await prisma.course.findUnique({
        where: { slug: courseSlug }
    })

    if (!course) {
        throw new Error("Curso não encontrado")
    }

    const lesson = await prisma.courseLesson.findUnique({
        where: { id: lessonId }
    })
    if (!lesson) {
        throw new Error("Aula não encontrada")
    }

    const comment = await prisma.lessonComment.create({
        data: {
            content,
            lessonId,
            userId,
            parentId,
        }
    })

    //  TODO NOTIFICAR USERS
    return comment;
}

export const deleteLessonComment = async (commentId: string) => {
    const { userId } = await getUser()

    const isAdmin = await checkRole("admin")
    const comment = await prisma.lessonComment.findUnique({
        where: { id: commentId },

    })

    if (!comment) {
        throw new Error("Comentário não encontrado")
    }

    if (!isAdmin && comment.userId !== userId) {
        throw new Error("Você não tem permissão para deletar este comentário")
    }

    await prisma.lessonComment.delete({
        where: { id: commentId }
    })
}