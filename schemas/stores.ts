import { z } from "zod"

export const createStoreSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    address: z.string().min(1, "La dirección es obligatoria"),
    logoUrl: z.string().url().optional(),
    featured: z.boolean().optional(),
    keywords: z.string().optional(),
    status: z.string(),
    adminId: z.number()
})

export const updateStoreSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre es obligatorio"),
    address: z.string().min(1, "La dirección es obligatoria"),
    logoUrl: z.any().optional(),
    featured: z.boolean().optional(),
    keywords: z.string().optional(),
    status: z.string(),
    adminId: z.number()
})