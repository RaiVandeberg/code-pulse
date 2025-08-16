import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { InputField } from "@/components/ui/form/input-fiel";
import { Form } from "@/components/ui/form/primitives";
import { CreateCourseFormData } from "@/server/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { title } from "process";
import { useForm, useFormContext } from "react-hook-form";
import z, { set } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { FormField } from "@/components/ui/form/field";
import { Editor } from "@/components/ui/editor";
import { use, useEffect } from "react";

const formSchema = z.object({
    title: z.string().nonempty({ message: "Título é obrigatório" }),
    description: z.string().nonempty({ message: "Descrição é obrigatória" }),
    videoId: z.string().nonempty({ message: "ID do vídeo é obrigatório" }),
    durationInMs: z.coerce.number().min(1, { message: "Duração deve ser um número positivo" })
})

type LessonsFormData = z.infer<typeof formSchema>;

type ManageLessonsDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    moduleIndex: number;
    initialData?: LessonFormItem | null;
    setInitialData: (data: LessonFormItem | null) => void;
}

export type LessonFormItem = LessonsFormData & {
    id: string;
}

export const ManageLessonDialog = ({ open, setOpen, moduleIndex, initialData, setInitialData }: ManageLessonsDialogProps) => {
    const { getValues, setValue, reset: resetForm } = useFormContext<CreateCourseFormData>()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            videoId: "",
            durationInMs: 0,
        }
    });
    const isEditing = !!initialData;
    const onSubmit = (data: LessonsFormData) => {
        const modules = getValues("modules");

        if (isEditing) {
            modules[moduleIndex].lessons = modules[moduleIndex].lessons.map((lesson) => {
                if (lesson.id === initialData.id) {
                    return {
                        ...lesson,
                        ...data
                    }
                }
                return lesson;
            }
            )
        } else {
            modules[moduleIndex].lessons.push({
                ...data,
                id: createId(),
                order: 1
            });
        }


        setValue("modules", modules, { shouldValidate: true });
        resetForm(getValues())
        setOpen(false);

    }

    const { handleSubmit, reset } = form



    useEffect(() => {
        if (!open) {
            reset({ description: "", title: "", durationInMs: 0, videoId: "" });
            setInitialData(null);
        }
    }, [open, reset, setInitialData]);


    useEffect(() => {
        if (open && initialData) {
            reset(initialData)
        }

    }, [open, initialData, reset])



    return (
        <Dialog
            title={isEditing ? "Editar Aula" : "Adicionar Aula"}
            open={open}
            setOpen={setOpen}
            width="500px"
            content={
                <Form {...form} >
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <InputField name="title" label="Título" />
                        <FormField
                            name="description"
                            label="Descrição">
                            {({ field }) => (
                                <Editor value={field.value} onChange={field.onChange} />
                            )}
                        </FormField>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField name="videoId" label="ID do Vídeo" />
                            <InputField name="durationInMs" label="Duração (ms)" type="number" />
                        </div>
                        <Button
                            // dar submit apenas nesse form
                            onClick={() => handleSubmit(onSubmit)()}
                            className="max-w-max ml-auto">
                            {isEditing ? "Salvar Alterações" : "Adicionar Aula"}
                        </Button>
                    </form>

                </Form>
            }

        >
        </Dialog>
    );
};
