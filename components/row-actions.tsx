"use client"

import { Eye, MoreHorizontal, Pen } from "lucide-react"
import { Row } from "@tanstack/react-table"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteButton from "@/components/delete-btn"

export default function RowActions<TModel extends { id: number }>({
    row,
    path,
    deleteAction,
    disabled,
}: {
    row: Row<TModel>,
    path: string,
    deleteAction: (itemId: number) => void,
    disabled?: boolean
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Button className="w-full" variant="ghost" asChild>
                        <Link
                            href={`${path}/${row.original.id}`}
                            className="flex items-center justify-start w-full"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Button className="w-full" variant="ghost" asChild>
                        <Link
                            href={`${path}/${row.original.id}/editar`}
                            className="flex items-center justify-start w-full"
                        >
                            <Pen className="h-4 w-4 mr-2" />
                            Editar
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <DeleteButton
                        className="w-full"
                        action={deleteAction}
                        itemId={row.original.id}
                        refUrl={path}
                        variant="ghost"
                        disabled={disabled}
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
