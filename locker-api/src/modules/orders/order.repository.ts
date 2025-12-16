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
                },
                items: {
                    include: {
                        product: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });
    }

    async createOrderAndItems(data: CreateOrderInput) {
        // Usamos $transaction para garantir que tudo aconteça ou nada aconteça
        return prisma.$transaction(async (tx) => {

            // 1. Verificar se há estoque para todos os itens (Opcional, mas recomendado)
            for (const item of data.items) {
                const product = await tx.product.findUnique({ where: { id: item.product_id_fk } });
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto ID ${item.product_id_fk}`);
                }
            }

            // 2. Criar o Pedido
            const order = await tx.order.create({
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

            // 3. Deduzir o Estoque dos Produtos
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.product_id_fk },
                    data: {
                        stock: {
                            decrement: item.quantity // Função atômica do Prisma para subtrair
                        }
                    }
                });
            }

            return order;
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