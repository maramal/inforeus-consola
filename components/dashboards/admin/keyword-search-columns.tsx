"use client"

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getRelativeDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";

export type KeywordSearch = {
    id: number;
    keyword: string;
    ipAddress: string;
    createdAt: Date;
};

function SortableColumn({
    name,
    column,
}: {
    name: string;
    column: Column<KeywordSearch, unknown>;
}) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

export const KeywordSearchColumns: ColumnDef<KeywordSearch>[] = [
    {
        accessorKey: "keyword",
        header: ({ column }) => <SortableColumn name="Palabra clave" column={column} />,
    },
    {
        accessorKey: "ipAddress",
        header: ({ column }) => <SortableColumn name="Dirección IP" column={column} />,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableColumn name="Fecha" column={column} />,
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            const formattedDate = format(createdAt, "dd/MM/yyyy");
            const relativeDate = getRelativeDate(createdAt);
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{formattedDate}</TooltipTrigger>
                        <TooltipContent>
                            <p>{relativeDate}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
];
