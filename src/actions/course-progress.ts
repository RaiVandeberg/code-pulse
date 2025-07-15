"use server"

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";


type CompleteLessonPayload = {
    courseSlug: string;
    lessonId: string;
}
export const markLessonAsCompleted = async ({ courseSlug, lessonId }: CompleteLessonPayload) => {


    const { userId } = await getUser()

    const course = await prisma.course.findUnique({
        where: {
            slug: courseSlug
        }
    })

    if (!course) {
        throw new Error("Course not found")
    }
    const isAlreadyCompleted = await prisma.completedLesson.findFirst({
        where: {
            lessonId,
            userId,
        }
    })

    if (isAlreadyCompleted) return isAlreadyCompleted

    const completedLesson = await prisma.completedLesson.create({
        data: {
            lessonId,
            userId,
            courseId: course.id
        }
    })

    return completedLesson
}