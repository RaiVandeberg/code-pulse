"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";
import { da, de, is, th } from "date-fns/locale";
import { checkRole } from "@/lib/clerk";
import { courseModuleSchema, CreateCourseFormData, CreateCourseModulePayload, createCourseSchema, UpdateCourseFormData, updateCourseSchema } from "@/server/schemas/course";
import slugify from "slugify"
import { revalidatePath } from "next/cache";
import { deleteFile, uploadFile } from "./upload";
import z from "zod";
import { CourseStatus } from "@/generated/prisma";

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

export const getAdminCourses = async () => {

    const isAdmin = await checkRole("admin");

    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const courses = await prisma.course.findMany({
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

export const getCourseTags = async () => {
    const tags = await prisma.courseTag.findMany({
        orderBy: {
            name: "asc",
        }
    });
    return tags;
}

export const creatCourseTags = async (name: string) => {

    const isAdmin = await checkRole("admin")
    if (!isAdmin) throw new Error("Unauthorized")

    const tag = await prisma.courseTag.create({
        data: {
            name
        }
    })

    return tag
}

export const createCourse = async (rawData: CreateCourseFormData) => {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) throw new Error("Unauthorized");

    const data = createCourseSchema.parse(rawData);

    const rawSlug = slugify(data.title, {
        lower: true,
        strict: true
    })

    const slugCount = await prisma.course.count({
        where: {
            slug: {
                startsWith: rawSlug
            }
        }
    })

    const slug = slugCount > 0 ? `${rawSlug}-${slugCount + 1}` : rawSlug;

    const { url: thumbnailUrl } = await uploadFile({
        file: data.thumbnail,
        path: `courses-thumbnails`
    })
    const course = await prisma.course.create({
        data: {
            title: data.title,
            description: data.description,
            shortDescription: data.shortDescription,
            price: data.price,
            discountPrice: data.discountPrice,
            difficulty: data.difficulty,
            slug,
            status: "DRAFT",
            thumbnail: thumbnailUrl,
            tags: {
                connect: data.tagIds.map((id) => ({
                    id
                }))
            },
            modules: {
                create: data.modules.map((mod) => ({
                    description: mod.description,
                    title: mod.title,
                    order: mod.order,
                    id: mod.id,
                    lessons: {
                        create: mod.lessons.map((lesson) => ({
                            id: lesson.id,
                            title: lesson.title,
                            description: lesson.description,
                            videoId: lesson.videoId,
                            durationInMs: lesson.durationInMs,
                            order: lesson.order,

                        }))
                    }


                }))
            }
        }

    })

    revalidatePath("/admin/courses")
    return course

}

export const updateCourse = async (rawData: UpdateCourseFormData) => {

    const isAdmin = await checkRole("admin");

    if (!isAdmin) throw new Error("Unauthorized");

    const data = updateCourseSchema.parse(rawData);

    const course = await prisma.course.findUnique({
        where: {
            id: data.id
        },
        include: {
            tags: true
        }
    })

    if (!course) throw new Error("Course not found");

    let slug = course.slug;
    let thumbnailUrl = course.thumbnail;

    if (data.title !== course.title) {
        const rawSlug = slugify(data.title, {
            lower: true,
            strict: true
        })
        const slugCount = await prisma.course.count({
            where: {
                slug: {
                    startsWith: rawSlug
                }
            }
        })

        slug = slugCount > 0 ? `${rawSlug}-${slugCount + 1}` : rawSlug;
    }

    if (data.thumbnail) {
        const { url: newThumbnailUrl } = await uploadFile({
            file: data.thumbnail,
            path: `courses-thumbnails`
        })

        thumbnailUrl = newThumbnailUrl;

        await deleteFile(course.thumbnail)
    }

    const updatedCourse = await prisma.course.update({
        where: {
            id: data.id,
        },
        data: {
            title: data.title,
            shortDescription: data.shortDescription,
            description: data.description,
            price: data.price,
            discountPrice: data.discountPrice,
            thumbnail: thumbnailUrl,
            slug,
            tags: {
                set: data.tagIds.map((id) => ({ id }))
            }
        }
    })

    revalidatePath("/")
    revalidatePath("/admin/courses")

    return updatedCourse;

}


export const deleteCourseLessons = async (lessonIds: string[]) => {

    const isAdmin = await checkRole("admin");

    if (!isAdmin) throw new Error("Unauthorized");

    await prisma.courseLesson.deleteMany({
        where: {
            id: {
                in: lessonIds
            }
        }
    })



}


export const deleteCourseModules = async (moduleIds: string[]) => {

    const isAdmin = await checkRole("admin");

    if (!isAdmin) throw new Error("Unauthorized");

    await prisma.courseModule.deleteMany({
        where: {
            id: {
                in: moduleIds
            }
        }
    })

}

export const createCourseModules = async (courseId: string, modules: CreateCourseModulePayload[]) => {
    const isAdmin = await checkRole("admin");

    if (!isAdmin) throw new Error("Unauthorized");

    const schema = z.array(courseModuleSchema)
    const data = schema.parse(modules)

    const courseModules = await Promise.all(data.map((mod) => prisma.courseModule.create({
        data: {
            title: mod.title,
            description: mod.description,
            order: mod.order,
            courseId,
            lessons: {
                createMany: {
                    data: mod.lessons.map((lesson) => ({
                        title: lesson.title,
                        description: lesson.description,
                        durationInMs: lesson.durationInMs,
                        order: lesson.order,
                        videoId: lesson.videoId,
                    }))
                }
            }
        }
    })))
    return courseModules;
}

export const updateCourseModules = async (modules: CreateCourseModulePayload[]) => {

    const isAdmin = await checkRole("admin");

    if (!isAdmin) throw new Error("Unauthorized");

    const schema = z.array(courseModuleSchema)
    const data = schema.parse(modules)

    await Promise.all(data.map(async (mod) => {
        await prisma.courseModule.update({
            where: { id: mod.id },
            data: {
                title: mod.title,
                description: mod.description,
                order: mod.order,

            }
        })

        await Promise.all(mod.lessons.map((lesson) => prisma.courseLesson.upsert({
            where: {
                id: lesson.id,
            },
            update: {
                title: lesson.title,
                description: lesson.description,
                durationInMs: lesson.durationInMs,
                order: lesson.order,
                videoId: lesson.videoId,
                moduleId: mod.id
            },
            create: {
                title: lesson.title,
                description: lesson.description,
                durationInMs: lesson.durationInMs,
                order: lesson.order,
                videoId: lesson.videoId,
                moduleId: mod.id
            }
        })))
    }))

}

export const revalidateCourseDetails = async (courseId: string) => {
    const isAdmin = await checkRole("admin");

    if (!isAdmin) throw new Error("Unauthorized");

    const course = await prisma.course.findUnique({
        where: { id: courseId }
    })

    if (!course) throw new Error("Course not found");


    revalidatePath(`/courses/details/${course.slug}`)
}

type updateCourseStatusPayload = {
    courseId: string;
    status: CourseStatus;
}

export const updateCourseStatus = async ({ courseId, status }: updateCourseStatusPayload) => {

    const isAdmin = await checkRole("admin");
    if (!isAdmin) throw new Error("Unauthorized");

    const course = await prisma.course.update({
        where: { id: courseId },
        data: { status }
    })

    revalidatePath("/")
    revalidatePath("/admin/courses")

    return course
}


export const deleteCourse = async (courseId: string) => {
    const isAdmin = await checkRole("admin");
    if (!isAdmin) throw new Error("Unauthorized");

    const course = await prisma.course.findUnique({
        where: { id: courseId }
    })

    if (!course) throw new Error("Course not found");

    await prisma.course.delete({
        where: { id: courseId }
    })
    await deleteFile(course.thumbnail)

    revalidatePath("/")
    revalidatePath("/admin/courses")
}