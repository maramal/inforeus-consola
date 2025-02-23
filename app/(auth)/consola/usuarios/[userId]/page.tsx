"use server"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Pen } from "lucide-react"
import { deleteUser, getUser, getUserByAuthId } from "@/actions/users"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getRelativeDate } from "@/lib/dates"
import DeleteButton from "@/components/delete-btn"
import Details, { DataProp } from "@/components/ui/details"
import { auth } from "@clerk/nextjs/server"

export default async function UserPage({ params }: {
    params: Promise<{ userId: string }>
}) {
    const { userId: userIdString } = await params
    const userId = Number(userIdString)
    if (!userId || isNaN(userId)) {
        notFound()
    }

    const { userId: authId, redirectToSignIn } = await auth()
    if (!authId) {
        return redirectToSignIn()
    }

    const loggedInUser = await getUserByAuthId(authId)
    if (loggedInUser.role === "Cliente" && loggedInUser.id !== userId) {
        notFound()
    }

    const user = await getUser(userId)
    if (!user) {
        notFound()
    }

    const createdAt = getRelativeDate(user.createdAt)
    const updatedAt = getRelativeDate(user.updatedAt)

    const data: DataProp[] = [
        {
            name: 'Nombre de usuario',
            value: user.username
        },
        {
            name: 'Rol',
            value: user.role
        },
        {
            name: 'Estado',
            value: user.status
        },
        {
            name: 'Creado',
            value: createdAt
        },
        {
            name: 'Actualizado',
            value: updatedAt
        }
    ]

    return (
        <div className="bg-gray-200 w-full h-screen flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-center">
                        {user.name}
                    </h1>
                </CardHeader>
                <CardContent className="space-y-2 mt-5">
                    <Details data={data} />
                </CardContent>
                <CardFooter className="flex justify-center space-x-4 mt-4">
                    <Button variant="default">
                        <Link className="flex items-center" href={`/consola/usuarios/${user.id}/editar`}>
                            <Pen className="h-4 w-4 mr-1" />
                            Editar
                        </Link>
                    </Button>
                    {(loggedInUser.id === user.id || loggedInUser.role === "Administrador") && (
                        <Button variant="outline">
                            <Link href={`/consola/usuarios/${user.id}/cambiar-password`}>
                                Cambiar contraseña
                            </Link>
                        </Button>
                    )}
                    {loggedInUser.role === "Administrador" && (
                        <DeleteButton
                            itemId={user.id}
                            action={deleteUser}
                            refUrl="/usuarios"
                        />
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
