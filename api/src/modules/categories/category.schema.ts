import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
});

export const updateCategorySchema = createCategorySchema
    .partial()
    .strict();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;