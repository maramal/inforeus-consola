"use server"

import { Store, columns } from "./columns"
import { DataTable, FilterInputProps } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { checkUserRole } from "@/lib/auth"
import { getStores } from "@/actions/stores"

async function getData(): Promise<Store[]> {
    const dbUsers = await getStores()
    const stores: Store[] = dbUsers.map((store) => ({
        id: store.id,
        name: store.name,
        featured: store.featured,
        website: store.website || '',
        status: store.status
    }))

    return stores
}

export default async function UsersPage() {
    const data = await getData()

    await checkUserRole('tiendas')

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
                <Link href="/consola/tiendas/nueva" className="space-x-2">Agregar tienda</Link>
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