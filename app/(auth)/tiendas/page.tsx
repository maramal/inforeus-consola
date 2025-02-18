import prisma from "@/lib/prisma"
import { Store, columns } from "./columns"
import { DataTable, FilterInputProps } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getData(): Promise<Store[]> {
    const dbUsers = await prisma.store.findMany()
    const stores: Store[] = dbUsers.map((store) => ({
        id: store.id,
        name: store.name,
        featured: store.featured,
        status: store.status
    }))

    return stores
}

export default async function UsersPage() {
    const data = await getData()

    const filterInputs: FilterInputProps[] = [
        {
            name: 'name',
            namePlural: 'nombres'
        },
        {
            name: 'featured',
            namePlural: 'destacados',
            type: 'boolean'
        },
        {
            name: 'status',
            namePlural: 'estados'
        },
    ]

    return (
        <div className="container mx-auto py-10">
            <Button className="mb-8">
                <Link href="tiendas/nueva" className="space-x-2">Agregar tienda</Link>
            </Button>
            <DataTable
                columns={columns}
                data={data}
                noResultText="No se encontraron tiendas"
                filterInputs={filterInputs}
            />
        </div>
    )
}