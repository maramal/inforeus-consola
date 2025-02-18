import { z } from 'zod'

export const createPaymentSchema = z.object({
    storeId: z.number(),
    ammount: z.number(),
    paymentMethod: z.string(),
    paid: z.boolean(),
})

export const updatePaymentSchema = z.object({
    id: z.number().optional(),
    storeId: z.number(),
    ammount: z.number(),
    paymentMethod: z.string(),
    paid: z.boolean(),
})