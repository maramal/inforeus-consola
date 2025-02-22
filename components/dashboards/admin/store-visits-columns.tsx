"use client"

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getRelativeDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Store } from "@prisma/client";
import Link from "next/link";

export type StoreVisit = {
    id: number;
    storeId: number;
    store: Store;
    ipAddress: string;
    createdAt: Date;
};

// Se define la columna para "Tienda" usando un accessorFn que extrae el nombre de la tienda
function SortableColumn({
    name,
    column,
}: {
    name: string;
    column: Column<StoreVisit, unknown>;
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

export const StoreVisitsColumns: ColumnDef<StoreVisit>[] = [
    {
        // Usamos accessorFn para obtener el nombre de la tienda y filtrarlo
        accessorFn: (row) => row.store.name,
        accessorKey: "storeName",
        header: ({ column }) => <SortableColumn name="Tienda" column={column} />,
        cell: ({ row }) => {
            const store = row.original.store;
            return (
                <Link href={`/tiendas/${store.id}`}>
                    {store.name}
                </Link>
            );
        },
    },
    {
        accessorKey: "ipAddress",
        header: ({ column }) => <SortableColumn name="Dirección IP" column={column} />,
        cell: ({ row }) => {
            const { ipAddress } = row.original;
            return (
                <Link href={`https://who.is/whois-ip/ip-address/${ipAddress}`} target="_blank">
                    {ipAddress}
                </Link>
            );
        },
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
