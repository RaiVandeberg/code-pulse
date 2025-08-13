"use client";

import { creatCourseTags, getCourseTags } from "@/actions/courses";
import { BackButton } from "@/components/ui/back-button";
import { FormField } from "@/components/ui/form/field";
import { InputField } from "@/components/ui/form/input-fiel";
import { Form, FormItem, FormLabel } from "@/components/ui/form/primitives";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";
import { Separator } from "@/components/ui/separator";
import { queryKeys } from "@/constants/query-key";
import { CreateCourseFormData, createCourseSchema } from "@/server/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { Resolver, useForm } from "react-hook-form";
import { set } from "zod";


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
    const { handleSubmit, control, setValue, watch } = methods

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
                    control={control}
                    placeholder="Curso de Java"

                />

                <InputField
                    name="shortDescription"
                    label="Descrição Curta"
                    control={control}
                    placeholder="Aprenda Java do zero ao avançado"

                />

                <InputField
                    name="price"
                    label="Preço"
                    control={control}
                    placeholder="R$ 99,90"

                />
                <InputField
                    name="discountPrice"
                    label="Preço com Desconto(opcional)"
                    control={control}
                    placeholder="R$ 79,90"
                />
                <FormField control={control} name="tagsIds" label="Tags">
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
            </form>
        </Form>
    </>
}