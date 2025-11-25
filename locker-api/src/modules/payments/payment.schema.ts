import z from "zod";

export const CartItemSchema = z.object({
    id: z.number().int().positive(),
    price: z.number().positive(),
    quantity: z.number().int().positive().min(1),
});

export const checkoutSchema = z.object({
    items: z.array(CartItemSchema).min(1, "O carrinho não pode estar vazio"),
    total: z.number().positive("O total deve ser um valor positivo"),
    userEmail: z.email("Formato de email inválido"),
    userName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    userId: z.number().int().positive()
});