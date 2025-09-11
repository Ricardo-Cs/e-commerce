import z from "zod";

export const loginAuthSchema = z.object({
    email: z.email("Formato de email inválido"),
    password: z.
        string().
        min(8, "A senha precisa ter pelo menos 8 caracteres.")
})