import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { InputField } from "@/components/ui/form/input-fiel";
import { Form } from "@/components/ui/form/primitives";
import { CreateCourseFormData } from "@/server/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { title } from "process";
import { useForm, useFormContext } from "react-hook-form";
import z from "zod";
import { createId } from "@paralleldrive/cuid2";
import { useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
    title: z.string().nonempty({ message: "Título é obrigatório" }),
    description: z.string().nonempty({ message: "Descrição é obrigatória" }),

})

type ModuleFormData = z.infer<typeof formSchema>;

export type ModuleFormItem = ModuleFormData & {
    id: string;

}

type ManageModuleDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: ModuleFormItem | null;
    setInitialData: (data: ModuleFormItem | null) => void;
}

export const ManageModuleDialog = ({ open, setOpen, initialData, setInitialData }: ManageModuleDialogProps) => {
    const { getValues, setValue, reset: resetForm } = useFormContext<CreateCourseFormData>()

    const form = useForm<ModuleFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })
    const onSubmit = (data: ModuleFormData) => {
        const modules = getValues("modules")
        if (isEditing) {
            const updatedModule = modules.map((mod) => {
                if (mod.id === initialData.id) {
                    return {
                        ...mod,
                        ...data
                    }
                }
                return mod;
            })
            setValue("modules", updatedModule, { shouldValidate: true })
            resetForm(getValues())
            setOpen(false);
            toast.success("Módulo atualizado com sucesso!");
            return;
        }
        //TODO EDIT MODULES

        modules.push({
            ...data,
            id: createId(),
            lessons: [],
            order: 1,
        })

        setValue("modules", modules, { shouldValidate: true })
        resetForm(getValues())
        setOpen(false);


    }

    const { handleSubmit, reset } = form

    const isEditing = !!initialData;



    useEffect(() => {
        if (open && initialData) {
            reset(initialData)
        }

    }, [open, initialData, reset])

    useEffect(() => {
        if (!open) {
            reset({ description: "", title: "" })
            setInitialData(null);
        }
    }, [open, reset, setInitialData])

    return (
        <Dialog
            title={isEditing ? "Editar Módulo" : "Adicionar Módulo"}
            open={open}
            setOpen={setOpen}
            width="500px"
            content={
                <Form {...form} >
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <InputField name="title" label="Título" />
                        <InputField name="description" label=" Breve Descrição sobre o módulo" />
                        <Button

                            // dar submit apenas nesse form
                            onClick={() => handleSubmit(onSubmit)()}
                            className="max-w-max ml-auto">
                            {isEditing ? "Salvar Alterações" : "Adicionar Módulo"}
                        </Button>
                    </form>

                </Form>
            }

        >
        </Dialog>
    );
};
