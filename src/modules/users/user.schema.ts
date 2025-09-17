import z from "zod";

export const createUserSchema = z.object({
    id: z.
        number("O id deve ser um valor numérico").
        optional(),
    name: z.
        string("O nome deve ser uma string").
        min(8, "O nome deve conter pelo menos 8 caracteres"),
    email: z.
        email("Formato do email inválido"),
    password: z.
        string("A senha deve ser uma string").
        min(8, "A senha deve conter pelo menos 8 caracteres")
});

export const updateUserSchema = z.object({
    name: z.
        string("O nome deve ser uma string").
        optional(),
    email: z.
        email("Formato de email inválido").
        optional(),
    password: z.
        string("A senha deve ser uma string").
        min(8, "A senha deve conter pelo menos 8 caracteres").
        optional()
})