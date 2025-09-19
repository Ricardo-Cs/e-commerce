import z from "zod";

export const insertItemCartSchema = z.object({
    cart_id_fk: z.int("O cart_id_fk deve ser um número").
        positive("O cart_id_fk não pode ser negativo"),
    product_id_fk: z.int("O product_id_fk deve ser um número").
        positive("O product_id_fk não pode ser negativo")
});

export const updateItemCartSchema = z.object({
    cart_id_fk: z.int("O cart_id_fk deve ser um número").
        positive("O cart_id_fk não pode ser negativo"),
    quantity: z.int("A quantidade deve ser um número").
        positive("O quantidade não pode ser negativa")
});