"use server"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Pen } from "lucide-react"
import { deleteUser, getUser } from "@/actions/users"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getRelativeDate } from "@/lib/dates"
import DeleteButton from "@/components/delete-btn"

export default async function UserPage({ params }: {
    params: Promise<{ userId: string }>
}) {
    const { userId: userIdString } = await params
    const userId = Number(userIdString)

    if (!userId || isNaN(userId)) {
        notFound()
    }

    const user = await getUser(userId)
    if (!user) {
        notFound()
    }

    const createdAt = getRelativeDate(user.createdAt)
    const updatedAt = getRelativeDate(user.updatedAt)

    return (
        <div className="bg-gray-200 w-full h-screen flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-center">
                        {user.name}
                    </h1>
                </CardHeader>
                <CardContent className="space-y-2 mt-5">
                    <p>
                        <span className="font-bold">Nombre de usuario:</span> {user.username}
                    </p>
                    <p>
                        <span className="font-bold">Rol:</span> {user.role}
                    </p>
                    <p>
                        <span className="font-bold">Estado:</span> {user.status}
                    </p>
                    <p>
                        <span className="font-bold">Fecha de creación:</span> {createdAt}
                    </p>
                    <p>
                        <span className="font-bold">Fecha de actualización:</span> {updatedAt}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4 mt-4">
                    <Button variant="default">
                        <Link className="flex items-center" href={`/usuarios/${user.id}/editar`}>
                            <Pen className="h-4 w-4 mr-1" />
                            Editar
                        </Link>
                    </Button>
                    <DeleteButton
                        itemId={user.id}
                        action={deleteUser}
                        refUrl="/usuarios"
                    />
                </CardFooter>
            </Card>
        </div>
    )
}
