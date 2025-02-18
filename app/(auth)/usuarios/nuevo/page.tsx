"use client"

import { useActionState } from "react";
import Form from "next/form";
import { createUser } from "@/actions/users";
import { UserRole, UserStatus } from "@prisma/client";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { createUserSchema } from "@/schemas/users";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const roles: UserRole[] = ["Cliente", "Administrador"];
const statuses: UserStatus[] = ["Activo", "Inactivo"];

export default function NewUserPage() {
    const [lastResult, action] = useActionState(createUser, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: createUserSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Crear Nuevo Usuario
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

                        {/* Field: Nombre de usuario */}
                        <div className="space-y-1">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Nombre de usuario
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.username.key}
                                name={fields.username.name}
                                defaultValue={fields.username.initialValue}
                                id="username"
                                placeholder="Ingrese el nombre de usuario"
                            />
                            {fields.username.errors && (
                                <p className="text-xs text-red-500">{fields.username.errors}</p>
                            )}
                        </div>

                        {/* Field: Contraseña */}
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <Input
                                className="mt-1"
                                key={fields.password.key}
                                name={fields.password.name}
                                defaultValue={fields.password.initialValue}
                                id="password"
                                type="password"
                            />
                            {fields.password.errors && (
                                <p className="text-xs text-red-500">{fields.password.errors}</p>
                            )}
                        </div>

                        {/* Field: Rol */}
                        <div className="space-y-1">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Rol
                            </label>
                            <select
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                key={fields.role.key}
                                name={fields.role.name}
                                defaultValue={fields.role.initialValue}
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

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">
                            Crear usuario
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
