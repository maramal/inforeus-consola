"use client"

import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { createStore } from "@/actions/stores";
import { StoreStatus, User } from "@prisma/client";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createStoreSchema } from "@/schemas/stores";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/actions/users";
import { Textarea } from "@/components/ui/textarea";

const statuses: StoreStatus[] = ["Activa", "Inactiva"];

export default function NewStorePage() {
    const [lastResult, action] = useActionState(createStore, undefined);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedAdminId, setSelectedAdminId] = useState<User | undefined>(undefined);
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [logoError, setLogoError] = useState<string>("");

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: createStoreSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    useEffect(() => {
        async function fetchUsers() {
            const userResponse = await getUsers();
            setUsers(userResponse);
        }
        fetchUsers();
    }, []);

    // Manejo de carga de imagen
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Validar que sea una imagen
        if (!file.type.startsWith("image/")) {
            setLogoError("El archivo debe ser una imagen.");
            setLogoUrl("");
            // También se puede limpiar el input si se desea.
            return;
        }
        // Validar tamaño (ejemplo: max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            setLogoError("La imagen debe pesar menos de 2MB.");
            setLogoUrl("");
            return;
        }
        setLogoError("");
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setLogoUrl(result);
            fields.logoUrl.value = result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Crear Nueva Tienda
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form
                        className="space-y-6"
                        id={form.id}
                        action={action}
                        onSubmit={form.onSubmit}
                    >
                        {/* Field: Nombre */}
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.name.key}
                                name={fields.name.name}
                                defaultValue={fields.name.initialValue}
                                id="name"
                                placeholder="Ingrese el nombre"
                            />
                            {fields.name.errors && (
                                <p className="text-xs text-red-500">{fields.name.errors}</p>
                            )}
                        </div>

                        {/* Field: Dirección */}
                        <div className="space-y-1">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Dirección
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.address.key}
                                name={fields.address.name}
                                defaultValue={fields.address.initialValue}
                                id="address"
                                placeholder="Ingrese la dirección"
                            />
                            {fields.address.errors && (
                                <p className="text-xs text-red-500">{fields.address.errors}</p>
                            )}
                        </div>

                        {/* Field: Logo URL (Carga de imagen) */}
                        <div className="space-y-1">
                            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                                Logo
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.logoUrl.key}
                                name="logoUrlFile"  // nombre temporal para el input file
                                id="logoUrl"
                                type="file"
                                onChange={handleLogoChange}
                            />
                            {logoError && (
                                <p className="text-xs text-red-500">{logoError}</p>
                            )}
                            {/* Input oculto para enviar el valor en base64 */}
                            <input type="hidden" name={fields.logoUrl.name} value={logoUrl} />
                            {fields.logoUrl.errors && (
                                <p className="text-xs text-red-500">{fields.logoUrl.errors}</p>
                            )}
                        </div>

                        {/* Field: Palabras clave */}
                        <div className="space-y-1">
                            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                                Palabras clave
                            </label>
                            <Textarea
                                className="mt-1"
                                key={fields.keywords.key}
                                name={fields.keywords.name}
                                defaultValue={fields.keywords.initialValue}
                                id="keywords"
                                placeholder="Separadas por comas"
                            />
                            {fields.keywords.errors && (
                                <p className="text-xs text-red-500">{fields.keywords.errors}</p>
                            )}
                        </div>

                        {/* Field: Sitio web */}
                        <div className="space-y-1">
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                Sitio web
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.website.key}
                                name={fields.website.name}
                                defaultValue={fields.website.initialValue}
                                id="website"
                                placeholder="Ingrese la URL del sitio web"
                            />
                            {fields.website.errors && (
                                <p className="text-xs text-red-500">{fields.website.errors}</p>
                            )}
                        </div>

                        {/* Field: Destacada (Rediseño del checkbox) */}
                        <div className="flex items-center space-x-3">
                            <input
                                id="featured"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                key={fields.featured.key}
                                name={fields.featured.name}
                                defaultValue={fields.featured.initialValue}
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                                Tienda Destacada
                            </label>
                            {fields.featured.errors && (
                                <p className="text-xs text-red-500">{fields.featured.errors}</p>
                            )}
                        </div>

                        {/* Field: Estado */}
                        <div className="space-y-1">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Estado
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                key={fields.status.key}
                                name={fields.status.name}
                                defaultValue={fields.status.initialValue}
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

                        {/* Field: Admin Id */}
                        <div className="space-y-1">
                            <label htmlFor="adminId" className="block text-sm font-medium text-gray-700">
                                Administrador
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                key={fields.adminId.key}
                                name={fields.adminId.name}
                                value={selectedAdminId?.id}
                                onChange={(e) => {
                                    const selectedUser = users.find((user) => user.id === Number(e.target.value));
                                    setSelectedAdminId(selectedUser);
                                }}
                                id="adminId"
                                disabled={users.length === 0}
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

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">
                            Crear tienda
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
