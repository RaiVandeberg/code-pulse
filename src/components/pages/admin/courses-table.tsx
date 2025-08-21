"use client"
import { deleteCourse, updateCourseStatus } from "@/actions/courses";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { formatPrice, formatStatus } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { is, ro } from "date-fns/locale";
import { Archive, Pencil, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";


type CoursesTableProps = {
    courses: CourseWithModulesAndTags[];
}

export const CoursesTable = ({ courses }: CoursesTableProps) => {

    const [search, setSearch] = useState("");

    const { mutateAsync: handleDeleteCourse, isPending: isDeletePending } = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            toast.success("Curso excluído com sucesso!")
        },
    });

    const { mutate: handleUpdateStatus, isPending: isStatusPending } = useMutation({
        mutationFn: updateCourseStatus,
        onSuccess: () => {
            toast.success("Status do curso atualizado com sucesso!")
        },
        onError: () => {

            toast.error("Erro ao atualizar status do curso.")
        }
    });

    const columns: ColumnDef<CourseWithModulesAndTags>[] = [
        {
            accessorKey: "title",
            header: "Título",
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }) => {
                const tags = row.original.tags;

                const firstTwoTags = tags.slice(0, 2);
                const remainingTags = tags.slice(2);
                return (
                    <div className="flex flex-wrap gap-1">
                        {firstTwoTags.map((tag) => (
                            <Badge key={`${row.original.id}-${tag.id}`} variant="outline">
                                {tag.name}
                            </Badge>
                        ))}
                        {remainingTags.length > 0 && (
                            <Tooltip content={remainingTags.map((tag) => tag.name).join(", ")}>
                                <Badge variant="outline">
                                    +{remainingTags.length}
                                </Badge>
                            </Tooltip>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: "price",
            header: "Preço",
            cell: ({ row }) => {
                const { price, discountPrice } = row.original;
                return (
                    <div className="flex items-center gap-2">
                        {!!discountPrice && (
                            <span className="text-[10px] text-muted-foreground line-through">
                                {formatPrice(price)}
                            </span>
                        )}
                        {formatPrice(discountPrice ?? price)}
                    </div>
                );
            }
        },
        {
            accessorKey: "modules",
            header: "Módulos",
            cell: ({ row }) => {
                const modules = row.original.modules;
                return `${modules.length} módulo(s)`;
            }
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={status === "PUBLISHED" ? "default" : "outline"}>
                        {formatStatus(status)}
                    </Badge>
                );
            }
        },
        {
            accessorKey: "createdAt",
            header: "Data de Criação",
            cell: ({ row }) => {
                const createdAt = row.original.createdAt;

                return format(createdAt, "dd/MM/yyyy");

            }
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => {
                const courses = row.original;
                const status = courses.status;
                const isPublished = status === "PUBLISHED";
                return (
                    <div className="flex items-center gap-2 justify-end">
                        <Tooltip content={`Alterar status para ${isPublished ? "rascunho" : "publicado"}`}>
                            <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus({
                                courseId: courses.id,
                                status: isPublished ? "DRAFT" : "PUBLISHED"
                            })}
                                disabled={isStatusPending}>
                                {isPublished ? < Archive /> : <Send />}

                            </Button>
                        </Tooltip>

                        <Tooltip content="Editar Curso">
                            <Link href={`/admin/courses/edit/${courses.id}`}>
                                <Button variant="ghost" size="icon">
                                    <Pencil />
                                </Button>
                            </Link>
                        </Tooltip>


                        <Tooltip content="Excluir Curso">
                            <AlertDialog
                                title="Excluir Curso"
                                description="Tem certeza que deseja excluir este curso?"
                                onConfirm={() => handleDeleteCourse(courses.id)}
                            >
                                <Button variant="ghost" size="icon" disabled={isDeletePending}>
                                    <Trash2 />
                                </Button>
                            </AlertDialog>
                        </Tooltip>

                    </div>
                )
            }
        }
    ]

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const lowerSearch = search.toLowerCase();
            const titleMatch = course.title.toLowerCase().includes(lowerSearch);
            const tagsMatch = course.tags.some((tag) => tag.name.toLowerCase().includes(lowerSearch));

            return titleMatch || tagsMatch;
        })
    }, [search, courses])

    return (
        <>

            <Input className="max-w-[400px]" placeholder="Buscar curso..." value={search} onChange={({ target }) => setSearch(target.value)} />

            <DataTable
                columns={columns}
                data={filteredCourses}
            />
        </>

    );
};
