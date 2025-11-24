import { PrismaClient, ProductImage } from "@prisma/client";
import type { Product } from "./product.types";

const prisma = new PrismaClient();

export class ProductRepository {
    async findAll(): Promise<Product[]> {
        return prisma.product.findMany();
    }

    async findAllPaginated(
        limit: number,
        skip: number,
        categories?: number[],
        maxPrice?: number
    ): Promise<[(Product & { images: ProductImage[] })[], number]> {

        const where: any = {};

        if (categories && categories.length > 0) {
            where.categories = {
                some: {
                    category_id: { in: categories },
                },
            };
        }

        if (maxPrice) {
            where.price = { lte: maxPrice };
        }

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                take: limit,
                skip: skip,
                where,
                include: {
                    images: true,
                    categories: {
                        include: { category: true }
                    }
                }
            }),

            prisma.product.count({ where })
        ]);

        return [products, total];
    }

    async findById(id: number) {
        return prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                categories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                parent: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                                children: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
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