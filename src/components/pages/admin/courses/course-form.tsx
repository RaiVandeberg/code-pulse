"use client";

import { creatCourseTags, createCourse, createCourseModules, deleteCourseLessons, deleteCourseModules, getCourseTags, revalidateCourseDetails, updateCourse, updateCourseModules } from "@/actions/courses";
import { BackButton } from "@/components/ui/back-button";
import { Dropzone } from "@/components/ui/dropzone";
import { Editor } from "@/components/ui/editor";
import { FormField } from "@/components/ui/form/field";
import { InputField } from "@/components/ui/form/input-fiel";
import { Form, FormItem, FormLabel } from "@/components/ui/form/primitives";
import { SelectField } from "@/components/ui/form/select-field";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";
import { Separator } from "@/components/ui/separator";
import { queryKeys } from "@/constants/query-key";
import { CourseDifficulty } from "@/generated/prisma";
import { formatDificulty, urlToFile } from "@/lib/utils";
import { CreateCourseFormData, createCourseSchema } from "@/server/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Value } from "@radix-ui/react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Resolver, useForm } from "react-hook-form";
import { set } from "zod";
import { ModulesList } from "./module-list";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { dequal } from "dequal";


type CourseFormInitialData = Omit<CreateCourseFormData, "thumbnail"> & {
    thumbnailUrl: string;
}

type CourseFormProps = {
    initialData?: CourseFormInitialData;
}

export const CourseForm = ({ initialData }: CourseFormProps) => {

    const router = useRouter();
    const queryClient = useQueryClient();
    const [initialDataIsSet, setInitialDataIsSet] = useState(false);
    const params = useParams()
    const isEditing = !!initialData
    const courseId = params.courseId as string;
    const methods = useForm<CreateCourseFormData>({
        resolver: zodResolver(createCourseSchema) as Resolver<CreateCourseFormData>,
        defaultValues: {
            title: "",
            shortDescription: "",
            price: 0,
            discountPrice: "" as unknown as number,
            description: "",
            difficulty: "EASY",
            tagIds: [],
            thumbnail: undefined as unknown as File,
            modules: [],
        },
    });
    const { handleSubmit, setValue, watch, reset, formState: { dirtyFields } } = methods

    const setInitialData = useCallback(async (data: CourseFormInitialData) => {
        const thumbnailFile = await urlToFile(data.thumbnailUrl);

        reset({
            ...data,
            thumbnail: thumbnailFile,
        });
        setInitialDataIsSet(true);
    }, [reset]);

    useEffect(() => {
        if (initialData) {
            setInitialData(initialData);
        }
    }, [initialData, setInitialData]);

    const tagIds = watch("tagIds");

    const { data: tagsData } = useQuery({
        queryKey: queryKeys.courseTags,
        queryFn: getCourseTags,
    })

    const { mutate: handleCreateTag, isPending: isAddingTags } = useMutation({
        mutationFn: creatCourseTags,
        onSuccess: (newTag) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courseTags });
            setValue("tagIds", [...tagIds, newTag.id], { shouldValidate: true });
        }
    });

    const tagsOptions = useMemo(() => {
        return (tagsData ?? []).map((tag) => ({
            label: tag.name,
            value: tag.id,
        }))
    }, [tagsData])

    const selectTags = useMemo(() => {
        return tagsOptions.filter((tag) => tagIds.includes(tag.value));
    }, [tagsOptions, tagIds])

    const handleChangeTags = (value: Option[]) => {
        const tagsToCreate = value.find((tag) => !tagsOptions.find((t) => t.value === tag.value));
        if (tagsToCreate) {
            handleCreateTag(tagsToCreate.value);
            return
        }
        setValue("tagIds", value.map((tag) => tag.value),
            { shouldValidate: true }
        );
    };

    const { mutate: handleUpdateCourse, isPending: isUpdatingCourse } = useMutation({
        mutationFn: async (data: CreateCourseFormData) => {
            if (!initialData) return

            await updateCourse({
                id: courseId,
                ...data,
                thumbnail: dirtyFields.thumbnail ? data.thumbnail : undefined,
            })

            const isModulesUpdated = !dequal(initialData.modules, data.modules)

            if (!isModulesUpdated) {
                await revalidateCourseDetails(courseId);
                return
            }

            const removedModules = initialData.modules.filter((mod) => !data.modules.find((m) => m.id === mod.id));

            const allLessons = data.modules.flatMap((mod) => mod.lessons);
            const allInitialLessons = initialData.modules.flatMap((mod) => mod.lessons);

            const removedLessons = allInitialLessons.filter((lesson) => !allLessons.find((l) => l.id === lesson.id));

            const modulesToCreate = data.modules.filter((mod) => !initialData.modules.find((m) => m.id === mod.id));

            const modulesToUpdate = data.modules.filter((mod) => !removedModules.find((m) => m.id === mod.id) && !modulesToCreate.find((m) => m.id === mod.id));

            if (!!removedLessons.length) {
                await deleteCourseLessons(removedLessons.map((lesson) => lesson.id));
            }

            if (!!removedModules.length) {
                await deleteCourseModules(removedModules.map((mod) => mod.id));
            }

            if (!!modulesToCreate.length) {
                await createCourseModules(courseId, modulesToCreate);
            }

            if (!!modulesToUpdate.length) {
                await updateCourseModules(modulesToUpdate);
            }

            await revalidateCourseDetails(courseId);
        },
        onSuccess: () => {
            toast.success("Curso atualizado com sucesso!");
            router.push("/admin/courses");
        },
        onError: (error) => {
            console.error("Erro ao atualizar curso:", error);
            toast.error("Erro ao atualizar curso, tente novamente mais tarde");
        }
    });

    const { mutate: handleCreateCourse, isPending: isCreatingCourse } = useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            toast.success("Curso criado com sucesso!");
            router.push("/admin/courses");
        },
        onError: (error) => {
            console.error("Erro ao criar curso:", error);
            toast.error("Erro ao criar curso, tente novamente mais tarde");
        }
    });

    const onSubmit = (data: CreateCourseFormData) => {
        const dataWithOrder: CreateCourseFormData = {
            ...data,
            modules: data.modules.map((module, index) => ({
                ...module,
                order: index + 1,
                lessons: module.lessons.map((lesson, lessonIndex) => ({
                    ...lesson,
                    order: lessonIndex + 1,
                })),
            })),
        };
        if (isEditing) {
            handleUpdateCourse(dataWithOrder);
            return
        }

        handleCreateCourse(dataWithOrder);
    };

    const difficultyOptions = [
        { label: formatDificulty(CourseDifficulty.EASY), value: CourseDifficulty.EASY },
        { label: formatDificulty(CourseDifficulty.MEDIUM), value: CourseDifficulty.MEDIUM },
        { label: formatDificulty(CourseDifficulty.HARD), value: CourseDifficulty.HARD },
    ];

    return <>
        <BackButton />

        <div>
            <h1 className="text-2xl font-bold">{isEditing ? "Editar Curso" : "Criar Curso"}</h1>

            <p className="text-muted-foreground mt-2">Preencha os dados abaixo para {isEditing ? "editar" : "criar"} um novo curso.</p>
        </div>

        <Separator className="my-2" />

        <Form {...methods}>

            <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                <InputField
                    name="title"
                    label="Título do Curso"

                    placeholder="Curso de Java"

                />

                <InputField
                    name="shortDescription"
                    label="Descrição Curta"

                    placeholder="Aprenda Java do zero ao avançado"

                />

                <InputField
                    name="price"
                    label="Preço"

                    placeholder="R$ 99,90"

                />
                <InputField
                    name="discountPrice"
                    label="Preço com Desconto(opcional)"

                    placeholder="R$ 79,90"
                />
                <FormField name="tagIds" label="Tags">
                    {() => (
                        <MultipleSelector
                            placeholder="Selecione as tags"
                            options={tagsOptions}
                            creatable
                            value={selectTags}
                            onChange={(value) => handleChangeTags(value)}
                            disabled={isAddingTags}
                        />
                    )}
                </FormField>

                <SelectField
                    name="difficulty"
                    label="Dificuldade"
                    options={difficultyOptions}
                />
                <FormField className="col-span-full" name="thumbnail" label="Thumbnail">
                    {({ field }) => (
                        <Dropzone
                            file={field.value}
                            setFiles={field.onChange}
                        />
                    )}
                </FormField>

                <FormField name="description" label="Descrição" className="col-span-full">
                    {({ field }) => (
                        <Editor
                            key={`editor-field-${initialDataIsSet}`}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                </FormField>

                <Separator className="my-2 col-span-full" />

                <ModulesList />
                <div className="col-span-full flex justify-end">
                    <Button type="submit" disabled={isCreatingCourse}> {isEditing ? "Atualizar Curso" : "Criar Curso"}</Button>
                </div>
            </form>
        </Form>
    </>
}