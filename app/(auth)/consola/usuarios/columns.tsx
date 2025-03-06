"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getRelativeDate } from "@/lib/dates"
import { Button } from "@/components/ui/button"
import RowActions from "@/components/row-actions"
import { deleteUser } from "@/actions/users"
import Link from "next/link"

export type User = {
    id: number
    name: string
    username: string
    role: string
    status: string
    createdAt: Date
}

function SortableColumn({
    name,
    column
}: {
    name: string,
    column: Column<User, unknown>
}) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <SortableColumn name="Nombre" column={column} />,
        cell: ({ row }) => {
            const user = row.original

            return (
                <Link href={`/consola/usuarios/${user.id}`}>{user.name}</Link>
            )
        }
    },
    {
        accessorKey: "username",
        header: ({ column }) => <SortableColumn name="Nombre de usuario" column={column} />,
        cell: ({ row }) => {
            const user = row.original

            return (
                <Link href={`/consola/usuarios/${user.id}`}>{user.username}</Link>
            )
        }
    },
    {
        accessorKey: "role",
        header: ({ column }) => <SortableColumn name="Rol" column={column} />
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableColumn name="Estado" column={column} />
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableColumn name="Fecha de creación" column={column} />,
        cell: ({ row }) => {
            const user = row.original

            const formattedDate = format(user.createdAt, "dd/MM/yyyy")
            const relativeDate = getRelativeDate(user.createdAt)

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{formattedDate}</TooltipTrigger>
                        <TooltipContent>
                            <p>{relativeDate}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <RowActions
                row={row}
                path="/consola/usuarios"
                deleteAction={deleteUser}
            />
        )
    }
]