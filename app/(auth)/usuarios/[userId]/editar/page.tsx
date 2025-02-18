"use client"

import { useActionState, useEffect, useState } from "react"
import Form from "next/form"
import { useParams } from "next/navigation"
import { UserRole, UserStatus, User } from "@prisma/client"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { updateUserSchema } from "@/schemas/users"
import { getUser, updateUser } from "@/actions/users"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const roles: UserRole[] = ["Administrador", "Cliente"]
const statuses: UserStatus[] = ["Activo", "Inactivo"]

export default function EditUserPage() {
    const { userId } = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [mounted, setMounted] = useState(false)
    const [lastResult, action] = useActionState(updateUser, undefined)

    useEffect(() => {
        const fetchUser = async () => {
            const $userId = Number(userId)

            if (!isNaN($userId)) {
                const userData = await getUser($userId)
                setUser(userData)
            }
        }

        fetchUser()
    }, [userId])

    useEffect(() => {
        setMounted(true)
    }, [])

    const [form, fields] = useForm({
        lastResult,
        defaultValue: {
            id: user?.id || 0,
            name: user?.name || "",
            username: user?.username || "",
            role: user?.role || "Cliente",
            status: user?.status || "Activo",
        },
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: updateUserSchema,
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    if (!mounted) return null

    if (!user) return <p>Cargando...</p>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Editar User
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form
                        className="space-y-6"
                        id={form.id}
                        action={action}
                        onSubmit={form.onSubmit}
                    >
                        {/* Campo ID oculto */}
                        {user && (
                            <input
                                type="hidden"
                                key={fields.id.key}
                                name={fields.id.name}
                                defaultValue={user.id}
                                id="id"
                            />
                        )}

                        {/* Campo: Nombre */}
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.name.key}
                                name={fields.name.name}
                                defaultValue={user?.name}
                                id="name"
                            />
                            {fields.name.errors && (
                                <p className="text-xs text-red-500">{fields.name.errors}</p>
                            )}
                        </div>

                        {/* Campo: Nombre de usuario */}
                        <div className="space-y-1">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <Input
                                className="mt-1"
                                defaultValue={user?.username}
                                id="username"
                                disabled
                            />
                        </div>

                        {/* Campo: Rol */}
                        <div className="space-y-1">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Rol
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                key={fields.role.key}
                                name={fields.role.name}
                                defaultValue={user?.role}
                                id="role"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            {fields.role.errors && (
                                <p className="text-xs text-red-500">{fields.role.errors}</p>
                            )}
                        </div>

                        {/* Campo: Estado */}
                        <div className="space-y-1">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Estado
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                key={fields.status.key}
                                name={fields.status.name}
                                defaultValue={user?.status}
                                id="status"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            {fields.status.errors && (
                                <p className="text-xs text-red-500">{fields.status.errors}</p>
                            )}
                        </div>

                        {/* Botón de enviar */}
                        <Button type="submit" className="w-full">
                            Guardar cambios
                        </Button>
                        <Button className="w-full" variant="link">
                            <Link href={`/usuarios/${userId}`}>Volver</Link>
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
