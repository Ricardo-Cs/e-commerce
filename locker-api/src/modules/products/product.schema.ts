import z from "zod";

export const createProductSchema = z.object({
    name: z.
        string("O nome deve ser uma string"),
    description: z.
        string("A descrição deve ser uma string").
        nullable().
        optional(),
    price: z.
        number("O preço deve ser um valor numérico").
        positive("O preço deve ser um valor maior do que 0"),
    stock: z.
        number("O estoque deve ser um valor numérico").
        int("O estoque deve ser um valor inteiro").
        nonnegative("O estoque deve ser um valor positivo"),
    imageUrl: z.
        url("Formato do url da imagem inválido").
        nullable().
        optional()
});

export const updateProductSchema = createProductSchema.partial();