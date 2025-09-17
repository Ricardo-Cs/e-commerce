import { PrismaClient } from "@prisma/client";
import type { Product } from "./product.types";

const prisma = new PrismaClient();

export class ProductRepository {
    async findAll(): Promise<Product[]> {
        return prisma.product.findMany();
    }

    async findById(id: number): Promise<Product | null> {
        return prisma.product.findUnique({ where: { id } });
    }

    async create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
        return prisma.product.create({ data });
    }

    async update(id: number, data: Partial<Product>): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<Product> {
        return prisma.product.delete({ where: { id } })
    }
}