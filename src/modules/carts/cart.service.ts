import { AppError } from "../../errors/AppError";
import type { Product } from "../products/product.types";
import { CartRepository } from "./cart.repository";
import { insertItemCartSchema, updateItemCartSchema } from "./cart.schema";
import type { CartItem, CartResponse } from "./cart.types";

const cartRepo = new CartRepository();

export class CartService {
    async getUserCart(user_id: number): Promise<CartResponse> {
        let cart = await cartRepo.findByUserId(user_id);
        if (!cart) cart = await cartRepo.create(user_id);

        const items = await cartRepo.findAllById(cart.id!);
        const products: Product[] = items.map(item => item.product);

        const cartResponse: CartResponse = {
            id: cart.id,
            user_id_fk: user_id,
            items: products
        };

        return cartResponse;
    }

    async insertItem(input: unknown): Promise<CartItem> {
        const data = insertItemCartSchema.parse(input);
        return await cartRepo.insertItem(data);
    }

    async updateCartItem(input: unknown): Promise<CartItem> {
        const data = updateItemCartSchema.parse(input);
        let cart = await cartRepo.findByUserId(data.cart_id_fk);
        if (!cart) throw new AppError("Produto não existe no carrinho", 401);

        return await cartRepo.updateItem(data.cart_id_fk, data.quantity);
    }
}