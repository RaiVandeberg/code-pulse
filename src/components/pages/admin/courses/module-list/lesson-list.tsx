import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { CreateCourseFormData } from "@/server/schemas/course";
import { fi } from "date-fns/locale";
import { GripVertical, Pen, Pencil, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LessonFormItem } from "./manage-lesson-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from "@hello-pangea/dnd"

type LessonListProps = {
    moduleIndex: number;
    onEditLesson: (lessonId: LessonFormItem) => void;
}

export const LessonsList = ({ moduleIndex, onEditLesson }: LessonListProps) => {
    const { control } = useFormContext<CreateCourseFormData>();

    const { fields, remove, move } = useFieldArray({
        control,
        name: `modules.${moduleIndex}.lessons`,
        keyName: "_id"
    });


    const handleDragEnd = ({ destination, source }: DropResult) => {
        if (destination) {
            move(source.index, destination.index);
        }
    }
    return (
        <div className="p-4 rounded-md bg-muted">
            {!fields.length && (
                <p className="text-sm text-muted-foreground text-center">Nenhuma aula adicionada</p>
            )}

            {!!fields.length && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="lessons">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="overflow-hidden flex flex-col text-center">

                                {fields.map((field, index) => (
                                    <Draggable
                                        key={`module-lessons-item-${field._id}`}
                                        draggableId={`module-lessons-item-${field._id}`}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                                className="w-full grid grid-cols-[30px_1fr] items-center bg-card rounded-md overflow-hidden border border-input mb-2">
                                                <div {...provided.dragHandleProps} className="w-full h-full bg-muted/50 flex items-center justify-center">
                                                    <GripVertical size={14} />
                                                </div>
                                                <div className="w-full h-full flex items-center justify-between gap-4 p-3">
                                                    <p className="font-semibold">{field.title}</p>
                                                    <div className="flex items-center gap-3">
                                                        <Tooltip content="Editar Aula">
                                                            <Button variant="ghost" size="icon" onClick={() => onEditLesson(field)}>
                                                                <Pen size={14} />
                                                            </Button>
                                                        </Tooltip>

                                                        <Tooltip content="Excluir  Aula">
                                                            <Button variant="ghost" size="icon" >
                                                                <AlertDialog
                                                                    title="Excluir Aula"
                                                                    description="Tem certeza de que deseja excluir esta aula?"
                                                                    onConfirm={() => remove(index)}
                                                                    toastMessage="Aula excluída com sucesso!"
                                                                >
                                                                    <Button variant="ghost" size="icon">
                                                                        <Trash size={14} />

                                                                    </Button>
                                                                </AlertDialog>
                                                            </Button>
                                                        </Tooltip>
                                                    </div>
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
        </div>
    );
};
