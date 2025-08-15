import { CourseDifficulty } from "@/generated/prisma";
import { z } from "zod";

const courseLessonSchema = z.object({
    id: z.string(),
    title: z.string().nonempty({ message: "Campo obrigatório" }),
    description: z.string().nonempty({ message: "Campo obrigatório" }),
    videoId: z.string().nonempty({ message: "Campo obrigatório" }),
    durationInMs: z.number().min(1, { message: "Campo obrigatório" }),
    order: z.number().min(1, { message: "Campo obrigatório" }),
});

export const courseModuleSchema = z.object({
    id: z.string(),
    title: z.string().nonempty({ message: "Campo obrigatório" }),
    description: z.string().nonempty({ message: "Campo obrigatório" }),
    order: z.number().min(1, { message: "Campo obrigatório" }),
    lessons: z
        .array(courseLessonSchema)
        .min(1, { message: "Adicione pelo menos uma aula" }),
});

export type CreateCourseModulePayload = z.infer<typeof courseModuleSchema>;

const courseSchema = z.object({
    title: z.string().nonempty({ message: "Campo obrigatório" }),
    shortDescription: z.string().optional(),
    price: z.coerce.number().min(1, { message: "Campo obrigatório" }),
    discountPrice: z.coerce.number().optional(),
    description: z.string().nonempty({ message: "Campo obrigatório" }),
    difficulty: z.nativeEnum(CourseDifficulty, { message: "Campo obrigatório" }),
    tagIds: z
        .array(z.string())
        .min(1, { message: "Selecione pelo menos uma tag" }),
    thumbnail: z.instanceof(File, { message: "Campo obrigatório" }),
});

export const createCourseSchema = courseSchema.extend({
    modules: z
        .array(courseModuleSchema)
        .min(1, { message: "Adicione pelo menos um módulo" }),
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = courseSchema.extend({
    id: z.string(),
    thumbnail: z.instanceof(File).optional(),
});

export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;