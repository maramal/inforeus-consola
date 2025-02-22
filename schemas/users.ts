import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio."),
    username: z.string().min(1, "El nombre de usuario es obligatorio."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.string(),
    status: z.string(),
})

export const updateUserSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "El nombre es obligatorio."),
    username: z.string().min(1, "El nombre de usuario es obligatorio."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.string(),
    status: z.string(),
})

export const updatePasswordSchema = z.object({
    id: z.number(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    retypePassword: z.string(),
}).refine((data) => data.password === data.retypePassword, {
    message: "Las contraseñas no coinciden",
    path: ["retypePassword"],
})