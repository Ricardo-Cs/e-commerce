import { PrismaClient } from "@prisma/client";
import type { Cart, CartItem, CartItemWithProduct } from "./cart.types";

const prisma = new PrismaClient();

export class CartRepository {
    async findByUserId(user_id: number): Promise<Cart | null> {
        return prisma.cart.findUnique({ where: { user_id_fk: user_id } })
    }

    async findAllById(cart_id: number): Promise<CartItemWithProduct[]> {
        return prisma.cartItem.findMany({
            where: { cart_id_fk: cart_id },
            include: { product: true },
        });
    }

    async create(user_id: number): Promise<Cart> {
        return prisma.cart.create({ data: { user_id_fk: user_id } });
    }

    async insertItem(data: Omit<CartItem, "id">): Promise<CartItem> {
        return prisma.cartItem.create({ data });
    }

    async updateItem(id: number, quantity: number): Promise<CartItem> {
        return prisma.cartItem.update({
            where: { id },
            data: { quantity }
        });
    }

    async deleteItem(id: number | number[]): Promise<void> {
        if (typeof id === "number") {
            await prisma.cartItem.delete({ where: { id } });
        } else {
            await prisma.cartItem.deleteMany({
                where: { id: { in: id } },
            });
        }
    }
}