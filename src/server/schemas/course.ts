import { CourseDifficulty } from "@/generated/prisma";
import { z } from "zod";



const courseLessonSchema = z.object({
    id: z.string(),
    title: z.string().nonempty({ message: "Campo Obrigatorio" }),
    description: z.string().nonempty({ message: "Campo Obrigatorio" }),
    videoId: z.string().nonempty({ message: "Campo Obrigatorio" }),
    durationInMs: z.number().min(1, { message: "Campo Obrigatorio" })
});

const courseModuleSchema = z.object({
    id: z.string(),
    title: z.string().nonempty({ message: "Campo Obrigatorio" }),
    description: z.string().nonempty({ message: "Campo Obrigatorio" }),
    order: z.number().min(1, { message: "Campo Obrigatorio" }),
    lessons: z.array(courseLessonSchema).min(1, { message: "Adicione pelo menos uma aula" })
});

export type CreateCourseModulePayload = z.infer<typeof courseModuleSchema>;

const courseSchema = z.object({

    title: z.string().nonempty({ message: "Campo Obrigatorio" }),
    shortDescription: z.string().max(200).optional(),
    price: z.coerce.number().min(1, { message: "Campo Obrigatorio" }),
    discountPrice: z.coerce.number().min(0).optional(),
    description: z.string().nonempty({ message: "Campo Obrigatorio" }),
    difficulty: z.nativeEnum(CourseDifficulty, { message: "Campo Obrigatorio" }),
    tagsIds: z.array(z.string()).min(1, { message: "Selecione pelo menos uma tag" }),
    thumbnail: z.instanceof(File, { message: "Campo Obrigatorio" })
});

export const createCourseSchema = courseSchema.extend({
    modules: z.array(courseModuleSchema).min(1, { message: "Adicione pelo menos um módulo" })
});

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;