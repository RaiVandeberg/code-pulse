"use client";

import { creatCourseTags, getCourseTags } from "@/actions/courses";
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
import { formatDificulty } from "@/lib/utils";
import { CreateCourseFormData, createCourseSchema } from "@/server/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Value } from "@radix-ui/react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { Resolver, useForm } from "react-hook-form";
import { set } from "zod";
import { ModulesList } from "./module-list";


export const CourseForm = () => {

    const queryClient = useQueryClient();
    const methods = useForm<CreateCourseFormData>({
        resolver: zodResolver(createCourseSchema) as Resolver<CreateCourseFormData>,
        defaultValues: {
            title: "",
            shortDescription: "",
            price: 0,
            discountPrice: "" as unknown as number,
            description: "",
            difficulty: "EASY",
            tagsIds: [],
            thumbnail: undefined as unknown as File,
            modules: [],
        },
    });
    const { handleSubmit, setValue, watch } = methods

    const tagIds = watch("tagsIds");

    const { data: tagsData } = useQuery({
        queryKey: queryKeys.courseTags,
        queryFn: getCourseTags,
    })

    const { mutate: handleCreateTag, isPending: isAddingTags } = useMutation({
        mutationFn: creatCourseTags,
        onSuccess: (newTag) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courseTags });
            setValue("tagsIds", [...tagIds, newTag.id], { shouldValidate: true });
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
        setValue("tagsIds", value.map((tag) => tag.value),
            { shouldValidate: true }
        );
    };

    const onSubmit = (data: CreateCourseFormData) => {
        console.log(data);
    };

    const difficultyOptions = [
        { label: formatDificulty(CourseDifficulty.EASY), value: CourseDifficulty.EASY },
        { label: formatDificulty(CourseDifficulty.MEDIUM), value: CourseDifficulty.MEDIUM },
        { label: formatDificulty(CourseDifficulty.HARD), value: CourseDifficulty.HARD },
    ];

    return <>
        <BackButton />

        <div>
            <h1 className="text-2xl font-bold">Criar Curso</h1>

            <p className="text-muted-foreground mt-2">Preencha os dados abaixo para criar um novo curso.</p>
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
                <FormField name="tagsIds" label="Tags">
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
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                </FormField>

                <Separator className="my-2 col-span-full" />

                <ModulesList />
            </form>
        </Form>
    </>
}