"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";
import { de } from "date-fns/locale";

type GetCoursesPayload = {
    query: string;
    tags: string[] | string;
}

export const getCourses = async ({ query, tags: rawTags }: GetCoursesPayload) => {
    const tags = !rawTags ? [] : Array.isArray(rawTags) ? rawTags : [rawTags];
    const hasTags = !!tags.length;
    const hasQuery = !!query?.trim();

    const courses = await prisma.course.findMany({
        where: {
            status: "PUBLISHED",
            tags: hasTags ? {
                some: {
                    id: {
                        in: tags,
                    }
                }
            } : undefined,
            OR: hasQuery ? [{
                title: { search: query }
            }, { description: { search: query } }]
                : undefined,
        },
        include: {
            tags: true,
            modules: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return courses;


}

export const getCourse = async (query: string, queryType: "slug" | "id" = "slug") => {

    const course = await prisma.course.findUnique({
        where: {
            slug: queryType === "slug" ? query : undefined,
            id: queryType === "id" ? query : undefined,
        },
        include: {

            modules: {
                include: {
                    lessons: {
                        orderBy: {
                            order: "asc",
                        }
                    }
                },
                orderBy: {
                    order: "asc",
                }
            },
            tags: true,
        }
    })
    return { course };
}


export const getPurchaseCourses = async (detailed = false) => {
    const { userId } = await getUser(false);
    if (!userId) return [];

    const purchasedCourses = await prisma.coursePurchase.findMany({
        where: {
            userId
        },
        include: {
            course: detailed ? {
                include: {
                    tags: true,
                    modules: true,
                },
            }
                : true
        }
    })

    return purchasedCourses.map((purchase) => purchase.course);
}

export const getPurchaseCoursesWithDetails = async () => {
    const purchasedCourses = await getPurchaseCourses(true);

    return purchasedCourses as CourseWithModulesAndTags[];
}
