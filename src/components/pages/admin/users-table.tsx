"use client"

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { formatName } from "@/lib/utils";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

type UsersTableProps = {
    users: AdminUser[]
}

export const UsersTable = ({ users }: UsersTableProps) => {

    const [search, setSearch] = useState("")

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const lowerSearch = search.toLowerCase();

            const nameMatch = formatName(user.fistName, user.lastName).toLowerCase().includes(lowerSearch);

            const emailMatch = user.email.toLowerCase().includes(lowerSearch);

            return nameMatch || emailMatch;
        })
    }, [search, users])

    const columns: ColumnDef<AdminUser>[] = [
        {
            header: "Nome",
            accessorKey: "fistName",
            cell: ({ row }) => {
                const user = row.original;
                const fullName = formatName(user.fistName, user.lastName);
                return (
                    <div className="flex items-center gap-2 p-2">
                        <Avatar src={user.imageUrl} fallback={fullName} />
                        <p className="font-medium">{fullName}</p>
                    </div>
                );
            }
        },
        {
            header: "Email",
            accessorKey: "email"

        },
        {
            header: "Cursos Comprados",
            accessorKey: "purchasedCourses"
        },
        {
            header: "Aulas Concluídas",
            accessorKey: "completedLesson"
        },
        {
            header: "Data de Criação",
            accessorKey: "createdAt",
            cell: ({ row }: any) => {
                const user = row.original;
                return format(user.createdAt, "dd/MM/yyyy");
            }
        }
    ]

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <Input
                    placeholder="Pesquisar Usuarios"
                    className="max-w-[400px]"
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                />

                <Button>

                    Enviar Notificacao
                </Button>
            </div>

            <DataTable columns={columns} data={filteredUsers} />
        </>
    );
};
