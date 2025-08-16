"use client";

import { Button } from "@/components/ui/button";
import { CreateCourseFormData } from "@/server/schemas/course";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ManageModuleDialog, ModuleFormItem } from "./manage-module-dialog";
import { GripVertical, Pen, Pencil, Plus, Trash } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { LessonsList } from "./lesson-list";
import { LessonFormItem, ManageLessonDialog } from "./manage-lesson-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from "@hello-pangea/dnd"

export const ModulesList = () => {
    const { control, formState: { errors } } = useFormContext<CreateCourseFormData>()
    const [showManageLessonDialog, setShowManageLessonDialog] = useState(false);
    const [moduleToEdit, setModuleToEdit] = useState<ModuleFormItem | null>(null);
    const [lessonToEdit, setLessonToEdit] = useState<LessonFormItem | null>(null);
    const [showManageModuleDialog, setShowManageModuleDialog] = useState(false);
    const [modulesIndex, setModulesIndex] = useState(0);
    const { fields, remove, move } = useFieldArray({
        control,
        name: "modules",
        keyName: "_id"
    })

    const handleDragEnd = ({ destination, source }: DropResult) => {
        if (destination) {
            move(source.index, destination.index);
        }
    }

    return (
        <div className="col-span-full flex flex-col">
            <div className=" flex items-center justify-between">
                <h2 className="text-xl font-bold">Módulos</h2>
                <Button className="mb-4" onClick={() => setShowManageModuleDialog(true)} >
                    Adicionar Módulo
                </Button>
            </div>

            {!fields.length && (
                <p className="text-sm text-muted-foreground">
                    Nenhum módulo adicionado. Clique em "Adicionar Módulo" para começar.
                </p>
            )}
            {!!fields.length && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="modules">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="overflow-hidden flex flex-col gap-4 mmt-6">
                                {fields.map((field, index) => (
                                    <Draggable key={`module-item-${field._id}`} draggableId={`module-item-${field._id}`} index={index}>
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                className="w-full grid grid-cols-[40px_1fr] items-center bg-muted/50 rounded-md overflow-hidden border border-input">
                                                <div {...provided.dragHandleProps} className="w-full h-full bg-muted flex items-center justify-center">
                                                    <GripVertical />
                                                </div>
                                                <div className="w-full h-full flex flex-col gap-4 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xl font-bold">{field.title}</p>
                                                            <p className="text-sm text-muted-foreground">{field.description}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3 ">
                                                            <Tooltip content="Editar Módulo" >
                                                                <Button variant="ghost" size="icon" onClick={() => {
                                                                    setModuleToEdit(field)
                                                                    setShowManageModuleDialog(true);
                                                                }}>
                                                                    <Pen />
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip content="Remover Módulo">
                                                                <AlertDialog
                                                                    title="Remover Módulo"
                                                                    description="Tem certeza de que deseja remover este módulo? Isso irá excluir todas as aulas do módulo."
                                                                    onConfirm={() => remove(index)}
                                                                    toastMessage="Módulo removido com sucesso!"
                                                                >
                                                                    <Button variant="ghost" size="icon">
                                                                        <Trash />
                                                                    </Button>
                                                                </AlertDialog>
                                                            </Tooltip>

                                                            <Button
                                                                onClick={() => {
                                                                    setModulesIndex(index);
                                                                    setShowManageLessonDialog(true);

                                                                }}
                                                            >
                                                                Adicionar Aula
                                                                <Plus />
                                                            </Button>

                                                        </div>
                                                    </div>
                                                    <LessonsList
                                                        moduleIndex={index}
                                                        onEditLesson={(lesson) => {
                                                            setModulesIndex(index);
                                                            setLessonToEdit(lesson);
                                                            setShowManageLessonDialog(true);
                                                        }}

                                                    />
                                                    {!!errors?.modules?.[index]?.lessons?.message && (
                                                        <p className="text-destructive text-sm text-center mt-6">{errors?.modules?.[index]?.lessons?.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            )}

            {!!errors.modules && (
                <p className="text-destructive text-sm text-center mt-6">{errors.modules.message}</p>
            )}

            <ManageModuleDialog
                open={showManageModuleDialog}
                setOpen={setShowManageModuleDialog}
                initialData={moduleToEdit}
                setInitialData={setModuleToEdit}
            />
            <ManageLessonDialog
                moduleIndex={modulesIndex}
                open={showManageLessonDialog}
                setOpen={setShowManageLessonDialog}
                initialData={lessonToEdit}
                setInitialData={setLessonToEdit}
            />
        </div>
    );
};
