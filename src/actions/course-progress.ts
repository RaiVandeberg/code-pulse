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

    const userHasCourse = await prisma.coursePurchase.findFirst({
        where: {
            userId,
            courseId: course.id,
        },
    })

    if (!userHasCourse) {
        throw new Error("Você não tem acesso a este curso")
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

export const unmarkLessonAsCompleted = async (lessonId: string) => {
    const { userId } = await getUser()

    const completedLesson = await prisma.completedLesson.findFirst({
        where: {
            lessonId,
            userId
        }
    })

    if (!completedLesson) return



    await prisma.completedLesson.delete({
        where: {
            id: completedLesson.id
        }
    })


}

export const getCourseProgress = async (courseSlug: string) => {
    const { userId } = await getUser()

    const course = await prisma.course.findUnique({
        where: {
            slug: courseSlug
        },
        include: {
            modules: {
                select: {
                    lessons: {
                        select: {
                            id: true,
                        },
                    }
                },
            },
        },
    })

    if (!course) {
        throw new Error("Course not found")
    }

    const completedLessons = await prisma.completedLesson.findMany({
        where: {
            courseId: course.id,
            userId
        }
    })

    const totalLessons = course.modules.flatMap(module => module.lessons).length;
    const completedLessonCount = completedLessons.length;

    const progress = Math.round((completedLessonCount / totalLessons) * 100);
    return {
        completedLessons,
        progress
    }
}