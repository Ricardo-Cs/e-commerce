// locker-api/src/modules/orders/order.repository.ts
import { Order, PrismaClient } from "@prisma/client";
import { CreateOrderInput } from "./order.types";

const prisma = new PrismaClient();

export class OrderRepository {
    async findAllForAdmin() {
        return prisma.order.findMany({
            select: {
                id: true,
                total: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });
    }
    async createOrderAndItems(data: CreateOrderInput) {
        return prisma.order.create({
            data: {
                user_id_fk: data.user_id_fk,
                total: data.total,
                status: "PENDING",
                items: {
                    createMany: {
                        data: data.items.map(item => ({
                            product_id_fk: item.product_id_fk,
                            quantity: item.quantity,
                            price: item.price,
                        }))
                    }
                }
            }
        });
    }

    async updateStatus(orderId: number, status: string) {
        return prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
    }

    // Cria um registro interno do pagamento (para rastreio)
    async createPayment(orderId: number, method: string, status: string = "PENDING") {
        return prisma.payment.create({
            data: {
                order_id: orderId,
                method: method,
                status: status
            }
        });
    }

    async findStatusById(orderId: number) {
        return prisma.order.findUnique({
            where: { id: orderId },
            select: { status: true }
        });
    }

    async findByUserId(userId: number) {
        return prisma.order.findMany({
            where: { user_id_fk: userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: {
                                    select: { url: true },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
}