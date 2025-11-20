import type { Product } from "../products/product.types";

export interface Cart {
    id?: number;
    user_id_fk?: number | null;
    createdAt?: Date;
}


export interface CartItem {
    id?: number;
    cart_id_fk: number;
    product_id_fk: number;
}

export interface CartResponse {
    id?: number;
    user_id_fk: number;
    items: Product[];
}

export type CartItemWithProduct = CartItem & { product: Product };