import { PrismaClient } from "@prisma/client";
import type { Category } from "./category.types";

const prisma = new PrismaClient();

export class CategoryRepository {
    async findAll(): Promise<Category[]> {
        return prisma.category.findMany();
    }

    async findById(id: number): Promise<Category | null> {
        return prisma.category.findUnique({ where: { id } })
    }

    async create(data: Omit<Category, "id">): Promise<Category> {
        return prisma.category.create({ data });
    }

    async update(id: number, data: Partial<Category>): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.category.delete({ where: { id } });
    }
}