"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import RowActions from "@/components/row-actions"
import { deleteUser } from "@/actions/users"

export type Store = {
    id: number
    name: string
    featured: boolean
    status: string
}

function SortableColumn({
    name,
    column
}: {
    name: string,
    column: Column<Store, unknown>
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

export const columns: ColumnDef<Store>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <SortableColumn name="Nombre" column={column} />
    },
    {
        accessorKey: "featured",
        header: ({ column }) => <SortableColumn name="Destacado" column={column} />
    },
    {
        accessorKey: "status",
        header: ({ column }) => <SortableColumn name="Estado" column={column} />
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <RowActions
                row={row}
                path="/tiendas"
                deleteAction={deleteUser}
            />
        )
    }
]