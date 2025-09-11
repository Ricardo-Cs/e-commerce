import z from "zod";

export const createUserSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    email: z.email(),
    password: z.string().min(8)
}); 