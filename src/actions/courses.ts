"use server";

import { prisma } from "@/lib/prisma";

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