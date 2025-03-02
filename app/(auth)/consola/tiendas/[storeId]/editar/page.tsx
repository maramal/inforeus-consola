"use client"

import { useActionState, useEffect, useState } from "react"
import Form from "next/form"
import { useParams } from "next/navigation"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { updateStoreSchema } from "@/schemas/stores"
import { getStore, updateStore } from "@/actions/stores"
import { getUsers } from "@/actions/users"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Store, User } from "@prisma/client"

const statuses = ["Activa", "Inactiva"]

function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

export default function EditStorePage() {
    const { storeId } = useParams()
    const [adminId, setAdminId] = useState<number | undefined>(undefined)
    const [store, setStore] = useState<Store>()
    const [users, setUsers] = useState<User[]>([])
    const [mounted, setMounted] = useState(false)
    const [logoBase64, setLogoBase64] = useState("")

    const [lastResult, action] = useActionState(updateStore, undefined)

    // Cargar datos de la tienda
    useEffect(() => {
        const fetchStore = async () => {
            const $storeId = Number(storeId)
            if (!isNaN($storeId)) {
                const storeData = await getStore($storeId)
                if (storeData) {
                    setAdminId(storeData.adminId)
                    setStore(storeData)
                }
            }
        }
        fetchStore()
    }, [storeId])

    // Cargar lista de administradores
    useEffect(() => {
        const fetchUsers = async () => {
            const userResponse = await getUsers()
            setUsers(userResponse)
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        setMounted(true)
    }, [])

    const [form, fields] = useForm({
        lastResult,
        defaultValue: {
            id: String(store?.id) || "",
            name: store?.name || "",
            address: store?.address || "",
            // En edición, el valor actual de logoUrl se mantiene; si el usuario carga una nueva imagen,
            // se deberá manejar de forma similar al formulario de creación (convertir a base64).
            logoUrl: store?.logoUrl || "",
            featured: store?.featured || false,
            keywords: store?.keywords ? store.keywords.join(", ") : "",
            website: store?.website || "",
            status: store?.status || "Activa",
            adminId: store?.adminId || ""
        },
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: updateStoreSchema,
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })

    if (!mounted) return null
    if (!store) return <p>Cargando...</p>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Editar Tienda
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
                        <input
                            type="hidden"
                            key={fields.id.key}
                            name={fields.id.name}
                            defaultValue={store.id}
                            id="id"
                        />

                        {/* Campo: Nombre */}
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.name.key}
                                name={fields.name.name}
                                defaultValue={store.name}
                                id="name"
                                placeholder="Ingrese el nombre"
                            />
                            {fields.name.errors && (
                                <p className="text-xs text-red-500">{fields.name.errors}</p>
                            )}
                        </div>

                        {/* Campo: Dirección */}
                        <div className="space-y-1">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Dirección
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.address.key}
                                name={fields.address.name}
                                defaultValue={store.address}
                                id="address"
                                placeholder="Ingrese la dirección"
                            />
                            {fields.address.errors && (
                                <p className="text-xs text-red-500">{fields.address.errors}</p>
                            )}
                        </div>

                        {/* Campo: Logo (input file) */}
                        <div className="space-y-1">
                            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                                Logo
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.logoUrl.key}
                                name="logoUrl"
                                id="logoUrl"
                                type="file"
                                onChange={async (e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                      try {
                                        const base64 = await convertFileToBase64(file);
                                        setLogoBase64(base64);
                                      } catch (error) {
                                        console.error("Error al convertir la imagen a base64:", error);
                                      }
                                    }
                                  }}
                            />
                            <input type="hidden" name={fields.logoUrl.name} value={logoBase64 || store.logoUrl} />
                            {fields.logoUrl.errors && (
                                <p className="text-xs text-red-500">{fields.logoUrl.errors}</p>
                            )}
                            {/* Input oculto para enviar el valor del logo */}
                            <input type="hidden" name={fields.logoUrl.name} defaultValue={store.logoUrl} />
                        </div>

                        {/* Campo: Tienda Destacada */}
                        <div className="flex items-center space-x-3">
                            <input
                                id="featured"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                key={fields.featured.key}
                                name={fields.featured.name}
                                defaultChecked={store.featured}
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                                Tienda Destacada
                            </label>
                            {fields.featured.errors && (
                                <p className="text-xs text-red-500">{fields.featured.errors}</p>
                            )}
                        </div>

                        {/* Campo: Palabras clave */}
                        <div className="space-y-1">
                            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                                Palabras clave (separadas por comas)
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.keywords.key}
                                name={fields.keywords.name}
                                defaultValue={store.keywords ? store.keywords.join(", ") : ""}
                                id="keywords"
                                placeholder="Ej: moda, ropa, descuentos"
                            />
                            {fields.keywords.errors && (
                                <p className="text-xs text-red-500">{fields.keywords.errors}</p>
                            )}
                        </div>

                        {/* Campo: Sitio web */}
                        <div className="space-y-1">
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                Sitio web
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.website.key}
                                name={fields.website.name}
                                defaultValue={store.website || ""}
                                id="website"
                                placeholder="Ingrese el sitio web"
                            />
                            {fields.website.errors && (
                                <p className="text-xs text-red-500">{fields.website.errors}</p>
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
                                defaultValue={store.status}
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

                        {/* Campo: Administrador */}
                        <div className="space-y-1">
                            <label htmlFor="adminId" className="block text-sm font-medium text-gray-700">
                                Administrador
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                key={fields.adminId.key}
                                name={fields.adminId.name}
                                value={adminId}
                                id="adminId"
                                onChange={(e) => {
                                    setAdminId(Number(e.target.value))
                                 }}
                            >
                                {users.length > 0 ? (
                                    <option value="">Seleccionar un administrador</option>
                                ) : (
                                    <option value="">No se encontraron usuarios</option>
                                )}
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {fields.adminId.errors && (
                                <p className="text-xs text-red-500">{fields.adminId.errors}</p>
                            )}
                        </div>

                        {/* Botón de enviar */}
                        <Button type="submit" className="w-full">
                            Guardar cambios
                        </Button>
                        <Button className="w-full" variant="link">
                            <Link href={`/consola/tiendas/${store.id}`}>Volver</Link>
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
