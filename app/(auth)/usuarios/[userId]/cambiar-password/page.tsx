"use client"

import { getUser, getUserByAuthId, updatePassword } from "@/actions/users"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { updatePasswordSchema } from "@/schemas/users"
import { useAuth } from "@clerk/nextjs"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { User } from "@prisma/client"
import Form from "next/form"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import PasswordValidator, { validatePassword } from "@/components/password-validator"
import { Eye, EyeOff } from "lucide-react"

export default function ChangePasswordPage() {
    const { userId } = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
    const [mounted, setMounted] = useState(false)
    const [lastResult, action] = useActionState(updatePassword, undefined)
    const { userId: authId } = useAuth()
    const [submitError, setSubmitError] = useState<string | null>(null)
    // Estados para controlar la visibilidad de las contraseñas
    const [showPassword, setShowPassword] = useState(false)
    const [showRetypePassword, setShowRetypePassword] = useState(false)

    // Cargar usuario desde el parámetro
    useEffect(() => {
        async function fetchUser() {
            const $userId = Number(userId)
            if (!isNaN($userId)) {
                const userData = await getUser($userId)
                setUser(userData)
            }
        }
        fetchUser()
    }, [userId])

    // Cargar usuario autenticado
    useEffect(() => {
        async function fetchUser() {
            const dbUser = await getUserByAuthId(authId as string)
            setLoggedInUser(dbUser)
        }
        if (authId) {
            fetchUser()
        }
    }, [authId])

    // Comprobar que el usuario autenticado pueda cambiar sólo su contraseña
    useEffect(() => {
        if (user && loggedInUser) {
            if (loggedInUser.role === "Cliente" && loggedInUser.id !== user.id) {
                notFound()
            }
        }
    }, [user, loggedInUser])

    // Montar componente
    useEffect(() => {
        setMounted(true)
    }, [])

    // Validación de formulario con useForm
    const [form, fields] = useForm({
        lastResult,
        defaultValue: {
            id: user?.id ? String(user.id) : "",
            password: "",
            retypePassword: ""
        },
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: updatePasswordSchema
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput"
    })

    // Maneja el submit: si la validación falla, previene el envío; 
    // de lo contrario, deja que el form se envíe normalmente.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const password = fields.password.value || ""
        const retypePassword = fields.retypePassword.value || ""

        if (password !== retypePassword) {
            e.preventDefault()
            setSubmitError("Las contraseñas no coinciden")
            return
        }

        if (!validatePassword(password)) {
            e.preventDefault()
            setSubmitError("La contraseña no cumple con los requisitos")
            return
        }
        // Si pasa la validación, no se previene el submit y se ejecuta la acción.
    }

    if (!mounted) return null
    if (!user || !loggedInUser) return <p>Cargando...</p>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 space-x-8">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Actualizar Contraseña
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form
                        className="space-y-6"
                        id={form.id}
                        action={action}
                        onSubmit={handleSubmit}
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

                        {/* Campo: Contraseña */}
                        <div className="relative flex items-center">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mr-6">
                                Contraseña
                            </label>
                            <Input
                                className="mt-1 pr-10 w-full"
                                key={fields.password.key}
                                name={fields.password.name}
                                defaultValue=""
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-600" />
                                )}
                            </button>
                            {fields.password.errors && (
                                <p className="text-xs text-red-500">{fields.password.errors}</p>
                            )}
                        </div>

                        {/* Campo: Repetir Contraseña */}
                        <div className="relative flex items-center">
                            <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700">
                                Repetir Contraseña
                            </label>
                            <Input
                                className="mt-1 pr-10 w-full"
                                key={fields.retypePassword.key}
                                name={fields.retypePassword.name}
                                defaultValue=""
                                type={showRetypePassword ? "text" : "password"}
                                id="retypePassword"
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                onClick={() => setShowRetypePassword(!showRetypePassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                {showRetypePassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-600" />
                                )}
                            </button>
                            {fields.retypePassword.errors &&
                                Array.isArray(fields.retypePassword.errors) &&
                                fields.retypePassword.errors.map((error, i) => (
                                    <p className="text-xs text-red-500" key={i}>{error}</p>
                                ))}
                        </div>

                        {submitError && (
                            <p className="text-xs text-red-500">{submitError}</p>
                        )}

                        <Button type="submit" className="w-full">
                            Actualizar contraseña
                        </Button>
                        <Button className="w-full" variant="link">
                            <Link href={`/usuarios/${userId}`}>Cancelar</Link>
                        </Button>
                    </Form>
                </CardContent>
            </Card>
            <PasswordValidator password={fields.password.value || ""} />
        </div>
    )
}
