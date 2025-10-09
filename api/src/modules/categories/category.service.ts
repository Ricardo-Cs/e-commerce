import { AppError } from "../../errors/AppError";
import { CategoryRepository } from "./category.repository";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import type { Category } from "./category.types";

const repo = new CategoryRepository();

export class CategoryService {
    async getAll(): Promise<Category[]> {
        return await repo.findAll();
    }

    async create(input: unknown): Promise<Category> {
        const data = createCategorySchema.parse(input);
        return await repo.create(data);
    }

    async update(id: number, input: unknown): Promise<Category> {
        const category = await repo.findById(id);
        if (!category) throw new AppError("Categoria não existe", 400)
        const data = updateCategorySchema.parse(input);
        return await repo.update(id, data);
    }

    async delete(id: number): Promise<void> {
        const category = await repo.findById(id);
        if (!category) throw new AppError("Categoria não existe", 400)
        await repo.delete(id);
    }
}