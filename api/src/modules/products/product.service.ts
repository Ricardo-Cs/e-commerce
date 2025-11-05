import { AppError } from "../../errors/AppError";
import cloudinary from "../../libs/cloudinary/cloudinary";
import { ProductRepository } from "./product.repository";
import { createProductSchema, updateProductSchema } from "./product.schema";
import type { PaginatedProducts, Product } from "./product.types";

const repo = new ProductRepository()

export class ProductService {
    async getWithPagination(page: number = 1, limit: number = 10): Promise<PaginatedProducts> {
        const pageSize = limit > 0 ? limit : 10;
        const pageNumber = page > 0 ? page : 1;

        // Calcula o offset (skip)
        const skip = (pageNumber - 1) * pageSize;

        // Chamamos o repositório para buscar os produtos e o total
        const [products, total] = await repo.findAllPaginated(pageSize, skip);

        const totalPages = Math.ceil(total / pageSize);

        return {
            products,
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages
        };
    }

    async getById(id: number): Promise<Product> {
        const product = await repo.findById(id);
        if (!product) throw new AppError("Produto não encontrado!", 400);
        return product;
    }

    async create(input: unknown): Promise<Omit<Product, "id" | "createdAt" | "updatedAt">> {
        const data = createProductSchema.parse(input) as unknown as Product;
        return repo.create(data);
    }

    async createMany(input: unknown[]): Promise<Omit<Product, "id" | "createdAt" | "updatedAt">[]> {
        const results = [];

        for (const element of input) {
            const data = createProductSchema.parse(element) as unknown as Product;
            const created = await repo.create(data);
            results.push(created);
        }

        return results;
    }

    async update(id: number, input: unknown) {
        // Valida o input com Zod e força o tipo para Partial<Product> para compatibilidade com o repository
        const data = updateProductSchema.parse(input) as Partial<Product>;
        return repo.update(id, data);
    }

    async delete(id: number): Promise<void> {
        repo.delete(id);
    }

    async uploadImage(filePath: string) {
        const result = await cloudinary.uploader.upload(filePath)
        return result.secure_url
    }

    async addImagesToProduct(productId: number, urls: string[]) {
        return repo.addImages(productId, urls)
    }
}