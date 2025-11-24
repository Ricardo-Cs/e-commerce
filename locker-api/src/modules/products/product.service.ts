import { AppError } from "../../errors/AppError";
import cloudinary from "../../libs/cloudinary/cloudinary";
import { ProductRepository } from "./product.repository";
import { createProductSchema, updateProductSchema } from "./product.schema";
import type { PaginatedProducts, Product } from "./product.types";
import fs from "fs/promises";

const repo = new ProductRepository()

export class ProductService {
    async getWithPagination(
        page: number = 1,
        limit: number = 10,
        categories?: number[],
        maxPrice?: number
    ): Promise<PaginatedProducts> {

        const pageSize = limit > 0 ? limit : 10;
        const pageNumber = page > 0 ? page : 1;
        const skip = (pageNumber - 1) * pageSize;

        const [products, total] = await repo.findAllPaginated(
            pageSize,
            skip,
            categories,
            maxPrice
        );

        return {
            products,
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }

    async getById(id: number) {
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
        await fs.unlink(filePath) // remove o arquivo local após upload
        return result.secure_url
    }

    async addImagesToProduct(productId: number, urls: string[]) {
        return repo.addImages(productId, urls)
    }
}