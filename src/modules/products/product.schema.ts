import z from "zod";

export const createProductSchema = z.object({
    name: z.string().min(2),
    description: z.string().nullable().optional(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    imageUrl: z.url().nullable().optional()
});

export const updateProductSchema = createProductSchema.partial();