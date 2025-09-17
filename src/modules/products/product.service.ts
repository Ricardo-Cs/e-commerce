import { AppError } from "../../errors/AppError";
import { ProductRepository } from "./product.repository";
import { createProductSchema, updateProductSchema } from "./product.schema";
import type { Product } from "./product.types";

const repo = new ProductRepository()

export class ProductService {
    async getAll() {
        return repo.findAll();
    }

    async getById(id: number) {
        const product = await repo.findById(id);
        if (!product) throw new AppError("Produto não encontrado!", 400);
        return product;
    }

    async create(input: unknown) {
        const data = createProductSchema.parse(input) as unknown as Product;
        return repo.create(data);
    }

    async update(id: number, input: unknown) {
        // Valida o input com Zod e força o tipo para Partial<Product> para compatibilidade com o repository
        const data = updateProductSchema.parse(input) as Partial<Product>;
        return repo.update(id, data);
    }

    async delete(id: number) {
        return repo.delete(id);
    }
}