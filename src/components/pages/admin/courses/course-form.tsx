"use client";

import { BackButton } from "@/components/ui/back-button";
import { InputField } from "@/components/ui/form/input-fiel";
import { Form } from "@/components/ui/form/primitives";
import { Separator } from "@/components/ui/separator";
import { CreateCourseFormData, createCourseSchema } from "@/server/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";

import { Resolver, useForm } from "react-hook-form";


export const CourseForm = () => {

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
    const { handleSubmit, control } = methods
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
            </form>
        </Form>
    </>
}