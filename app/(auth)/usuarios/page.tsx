import prisma from "@/lib/prisma"
import { User, columns } from "./columns"
import { DataTable, FilterInputProps } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getData(): Promise<User[]> {
    const dbUsers = await prisma.user.findMany()
    const users: User[] = dbUsers.map((user) => ({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
    }))

    return users
}

export default async function UsersPage() {
    const data = await getData()

    const filterInputs: FilterInputProps[] = [
        {
            name: 'name',
            namePlural: 'nombres'
        },
        {
            name: 'username',
            namePlural: 'nombres de usuario'
        },
        {
            name: 'role',
            namePlural: 'roles'
        },
        {
            name: 'status',
            namePlural: 'estados'
        },
        {
            name: 'createdAt',
            namePlural: 'fechas de creación',
            type: 'date'
        },
    ]

    return (
        <div className="container mx-auto py-10">
            <Button className="mb-8">
                <Link href="usuarios/nuevo" className="space-x-2">Agregar usuario</Link>
            </Button>
            <DataTable
                columns={columns}
                data={data}
                noResultText="No se encontraron usuarios"
                filterInputs={filterInputs}
            />
        </div>
    )
}