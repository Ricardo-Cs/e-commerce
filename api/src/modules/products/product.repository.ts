import { PrismaClient } from "@prisma/client";
import type { Product } from "./product.types";

const prisma = new PrismaClient();

export class ProductRepository {
    async findAll(): Promise<Product[]> {
        return prisma.product.findMany();
    }

    async findAllPaginated(limit: number, skip: number): Promise<[Product[], number]> {
        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                take: limit, // LIMIT
                skip: skip,  // OFFSET
            }),
            prisma.product.count(),
        ]);

        return [products as Product[], total];
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

    async delete(id: number): Promise<void> {
        await prisma.product.delete({ where: { id } })
    }

    async addImages(productId: number, urls: string[]) {
        return prisma.product.update({
            where: { id: productId },
            data: {
                images: {
                    create: urls.map(url => ({ url }))
                }
            },
            include: { images: true }
        })
    }


}