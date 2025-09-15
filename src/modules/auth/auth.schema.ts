import z from "zod";

export const loginAuthSchema = z.object({
    email: z.email("Formato de email inválido"),
    password: z.
        string("A senha deve ser uma string").
        min(8, "A senha precisa ter pelo menos 8 caracteres")
})

export const registerAuthSchema = z.object({
    email: z.email("Formato de email inválido"),
    password: z.
        string("A senha deve ser uma string").
        min(8, "A senha precisa ter pelo menos 8 caracteres"),
    name: z.
        string("A senha deve ser uma string").
        min(8, "O nome precisa ter pelo menos 8 caracteres"),
    isAdmin: z.boolean().nullable()
});